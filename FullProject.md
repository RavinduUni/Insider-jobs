# Full Project Technical Documentation: InsiderJobs Platform

This document provides a comprehensive, highly detailed technical overview of the InsiderJobs platform. It covers the security architecture, role-specific features and workflows, function-level analysis, data flow, and exact code integrations driving the system.

---

## 1. Security Architecture

The platform implements a robust security model to protect user data, ensure authorized access, and validate inputs across all boundaries.

### 1.1 JWT Authentication & Role-Based Access Control (RBAC)
Authentication is stateless, utilizing JSON Web Tokens (JWT). When a user (Student, Recruiter, or Admin) logs in, the server generates a token containing their unique `userId` and `role`. 
For subsequent requests to protected routes, the `verifyToken` middleware intercepts the request, decodes the token, and fetches the respective user from the database based on their role, injecting it into the request object (`req.user`). This enforces RBAC inherently.

**Code Integration: `server/middlewares/verifyToken.js`**
```javascript
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import Admin from '../models/Admin.js';

export const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const role = decoded.role;
        
        if (role === 'student') {
            req.user = await Student.findById(decoded.userId).select('-password');
        } else if (role === 'recruiter') {
            req.user = await Recruiter.findById(decoded.userId).select('-password');
        } else if (role === 'admin') {
            req.user = await Admin.findById(decoded.userId).select('-password');
        }
        
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'user not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}
```

### 1.2 Password Encryption
Passwords are never stored in plaintext. The system uses the `bcrypt` library to hash passwords with a salt factor of 10 before saving them to the MongoDB database. During login, the provided password is compared against the stored hash using `bcrypt.compare`.

**Code Integration: Registration (`server/controllers/studentController.js`)**
```javascript
// Hashing during registration
const hashedPassword = await bcrypt.hash(password, 10);

const newStudent = new Student({
    name, email, password: hashedPassword, university, major, resume: resumeUrl
});
await newStudent.save();
```

**Code Integration: Login (`server/controllers/studentController.js`)**
```javascript
// Comparing during login
const student = await Student.findOne({ email });
if (!student) return res.status(400).json({ success: false, message: 'Invalid email or password' });

const isPasswordValid = await bcrypt.compare(password, student.password);
if (!isPasswordValid) return res.status(400).json({ success: false, message: 'Invalid email or password' });
```

### 1.3 OTP Verification
Email verification is facilitated using One-Time Passwords (OTPs). The system generates a numeric OTP and dispatches it via email using Nodemailer (configured via SMTP).

**Code Integration: `server/controllers/studentController.js`**
```javascript
export const sendEmailVerificationOtp = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const otp = generateOtp(); // Generates a random OTP
        await sendOtpEmail(email, otp, name); // Sends email via Nodemailer
        
        return res.status(200).json({ success: true, message: 'OTP sent to email', otp });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ success: false, message: 'Error sending OTP email' });
    }
}
```

### 1.4 Input Sanitization & Validation
Data validation occurs at both the controller and schema levels. Mongoose schemas strictly define data types and regex constraints (e.g., email formatting). Controllers manually sanitize arrays and file inputs to prevent malicious uploads.

**Code Integration: Mongoose Schema (`server/models/Student.js`)**
```javascript
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/ // Regex validation for email
    },
```

**Code Integration: Array Sanitization (`server/controllers/studentController.js`)**
```javascript
    // Sanitizing skills array from request body
    if (skills) {
        const parsedSkills = JSON.parse(skills);
        student.skills = Array.isArray(parsedSkills)
            ? parsedSkills.map(skill => String(skill).trim()).filter(skill => skill.length > 0)
            : student.skills;
    }
```

---

## 2. Role-Specific Features & Workflows

### 2.1 Student Role
- **Onboarding:** Registers with university details, verifies email via OTP, uploads a CV.
- **Profile Management:** Can update bio, skills, profile picture, and use an AI tool (Google Gemini) to enhance their resume text.
- **Discovery & Application:** Can view recommended projects matched by AI based on their skills. Applies to projects by submitting a CV and a project plan.
- **Contracts & Wallet:** Uploads signed NDAs. Tracks application status, earnings, and completed project history via the Wallet interface.

### 2.2 Recruiter Role
- **Onboarding:** Registers company details and uploads a company logo.
- **Project Lifecycle:** Posts new projects (specifying budget, deadline, requirements). Edits or deletes projects.
- **Applicant Tracking:** Views student applications, downloads CVs and project plans.
- **Contracting & Payment:** Sends NDAs to selected students, assigns the final project, processes payments (marks as paid), and submits reviews for the student upon completion.

### 2.3 Admin Role
- **Platform Analytics:** Views high-level dashboard statistics (counts of students, recruiters, projects, applications, NDAs).
- **Moderation:** Full CRUD access to manage or forcefully delete users (Students/Recruiters) and their associated data (cascading deletes for applications, files, and NDAs).

---

## 3. Function-Level Analysis & Data Flow

### 3.1 Project Application Workflow (Student)

**How it works:** 
A student submits an application for a specific project. This requires uploading a CV and a Project Plan file. The transaction is handled atomically using MongoDB sessions. If file uploads to Cloudinary succeed but the database save fails, a cleanup process removes the orphaned files.

**Data Flow:**
1. **Client:** User selects files and submits a `FormData` object containing `cvFile`, `planFile`, and `projectId` to the API.
2. **Server Middleware:** `multer` intercepts the request and temporarily stores files. `verifyToken` authenticates the student.
3. **Server Controller:** Validates if the student already applied. Uploads files directly to Cloudinary.
4. **Database:** Creates a new `Application` document within a MongoDB transaction.
5. **Server -> Client:** Returns the application details or triggers rollback on failure.

**Code Integration: `server/controllers/studentController.js`**
```javascript
export const applyProject = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    let cvPublicId = null;
    let planPublicId = null;

    try {
        const studentId = req.user._id;
        const cvFile = req.files?.cvFile?.[0];
        const planFile = req.files?.planFile?.[0];
        const { projectId, notes, status } = req.body;

        // Cloudinary Uploads
        const cvUploadResult = await cloudinary.uploader.upload(cvFile.path, {
            folder: 'applications/cvs', resource_type: 'raw', use_filename: true, unique_filename: true
        });
        cvPublicId = cvUploadResult.public_id;

        const planUploadResult = await cloudinary.uploader.upload(planFile.path, {
            folder: 'applications/plans', resource_type: 'raw', use_filename: true, unique_filename: true
        });
        planPublicId = planUploadResult.public_id;

        // Database Entry
        const newApplication = new Application({
            studentId, projectId, cvUrl: cvUploadResult.secure_url, 
            projectPlanUrl: planUploadResult.secure_url, notes: notes || '', status: status || 'applied'
        });

        await newApplication.save({ session });
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ success: true, application: newApplication });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        // Cloudinary cleanup logic for orphaned files...
        return res.status(500).json({ success: false, message: error.message });
    }
}
```

### 3.2 AI-Powered Project Recommendations (Student)

**How it works:** 
The platform utilizes the Google Gemini API to recommend projects to a student based on their bio and skills compared against open projects.

**Data Flow:**
1. **Client:** Requests the recommendations dashboard.
2. **Server:** Fetches the logged-in student's `bio` and `skills`. Fetches all active projects from MongoDB.
3. **External API (Gemini):** Sends a prompt containing the student profile and simplified project list, enforcing a JSON response format.
4. **Server:** Parses the AI response, maps it back to full project data, sorts by `matchScore`, and returns to the client.

**Code Integration: `server/controllers/studentController.js`**
```javascript
export const recommendProjects = async (req, res) => {
    try {
        const { bio, skills } = req.user;
        const projects = await Project.find({ status: { $in: ['open', 'in_progress', 'completed'] } }).lean();

        const simplifiedProjects = projects.map(p => ({
            id: p._id.toString(), title: p.title, description: p.description, technologies: p.technologies
        }));

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `Recommend best projects. Return JSON: { "recommendations": [{ "projectId": "string", "matchScore": number }] }`
                },
                {
                    role: "user",
                    content: JSON.stringify({ student: { bio, skills }, projects: simplifiedProjects })
                }
            ]
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        // Mapping and sorting logic...
        return res.status(200).json({ success: true, recommendedProjects });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
```

### 3.3 Project Assignment & Auto-Rejection Workflow (Recruiter)

**How it works:** 
When a recruiter definitively assigns a project to a selected student, the system updates the application status to `assigned`, updates the project status to `in progress`, and automatically iterates over all other competing applications for that project, marking them as `rejected`.

**Data Flow:**
1. **Client:** Recruiter clicks "Assign" on a specific application and sends a POST request with `studentId` and `projectId`.
2. **Server:** Verifies recruiter authorization. Fetches the target application and confirms it has passed the NDA/selection phase.
3. **Database (Target):** Updates target `Application` to `assigned`. Updates `Project` status.
4. **Database (Competitors):** Fetches all other `Application` records for the `projectId` and loops through them to update their status to `rejected`.

**Code Integration: `server/controllers/recruiterController.js`**
```javascript
export const assignProject = async (req, res) => {
    try {
        const recruiter = req.user;
        const { studentId, projectId } = req.body;

        const application = await Application.findOne({ studentId, projectId });
        application.status = 'assigned';
        await application.save();

        // Update project status
        const project = await Project.findById(projectId);
        project.status = 'in progress';
        await project.save();

        // Reject all other applicants for this project
        const applications = await Application.find({ projectId });
        applications.forEach(async (app) => {
            if (app.status !== 'assigned') {
                app.status = 'rejected';
                await app.save();
            }
        });

        return res.status(200).json({ success: true, message: 'Project assigned successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
```

### 3.4 Cascading Data Deletion (Admin)

**How it works:** 
Administrators have the power to delete user accounts. Because data is heavily interconnected, deleting a student also purges all associated files in Cloudinary (profile pictures, resumes, application CVs, plan documents, and signed NDAs), followed by deleting the related records in MongoDB.

**Data Flow:**
1. **Client:** Admin issues a DELETE request for a specific student ID.
2. **Server:** Fetches the student record. Calls `deleteCloudinaryFile` utility for profile picture and resume.
3. **Database (Associations):** Finds all `Application` records. Iterates to delete associated CVs, plans, and NDAs from Cloudinary.
4. **Database (Cleanup):** Runs `deleteMany` on `NDA`, `Application`, and `Review` collections. Finally, deletes the `Student` document.

**Code Integration: `server/controllers/adminController.js`**
```javascript
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);

        // Delete primary files from Cloudinary
        await deleteCloudinaryFile(student.profilePicture);
        await deleteCloudinaryFile(student.resume);
        
        const applications = await Application.find({ studentId: id });
        
        for (const app of applications) {
            // Delete application files
            await deleteCloudinaryFile(app.cvUrl);
            await deleteCloudinaryFile(app.projectPlanUrl);

            // Delete associated NDAs
            const ndas = await NDA.find({ applicationId: app._id });
            for (const nda of ndas) {
                await deleteCloudinaryFile(nda.documentUrl);
            }
            await NDA.deleteMany({ applicationId: app._id });
        }
        
        // Clean up Mongo collections
        await Application.deleteMany({ studentId: id });
        await Review.deleteMany({ studentId: id });
        await Student.findByIdAndDelete(id);

        res.json({ success: true, message: 'Student and related records deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
```
