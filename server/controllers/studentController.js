import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import ai from "../configs/ai.js";
import e from "express";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import { generateOtp } from "../utils/generateOtp.js";

const ALLOWED_RESUME_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ALLOWED_RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'];

const getFileExtension = (filename = '') => {
    const parts = filename.toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() : '';
};

const isValidResumeFile = (file) => {
    if (!file) return false;
    const ext = getFileExtension(file.originalname || '');
    return ALLOWED_RESUME_MIME_TYPES.includes(file.mimetype) && ALLOWED_RESUME_EXTENSIONS.includes(ext);
};

export const sendEmailVerificationOtp = async (req, res) => {
    try {
        const {name, email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const otp = generateOtp();

        await sendOtpEmail(email, otp, name);
        return res.status(200).json({ success: true, message: 'OTP sent to email', otp });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ success: false, message: 'Error sending OTP email' });
    }
}

export const registerStudent = async (req, res) => {
    try {

        const { name, email, password, university, major } = req.body;

        const resume = req.file ? req.file.path : null;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }

        const isExistingStudent = await Student.findOne({ email });

        if (isExistingStudent) {
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (req.file && !isValidResumeFile(req.file)) {
            return res.status(400).json({ success: false, message: 'Only PDF, DOC, or DOCX resume files are allowed' });
        }

        let resumeUrl = '';
        if (resume) {
            const uploadResult = await cloudinary.uploader.upload(resume, {
                folder: 'students/resumes',
                resource_type: 'raw',
                use_filename: true,
                unique_filename: true,
            });
            resumeUrl = uploadResult.secure_url;
        }


        const newStudent = new Student({
            name,
            email,
            password: hashedPassword,
            university,
            major,
            resume: resumeUrl
        });

        await newStudent.save();

        const token = generateToken(newStudent._id, 'student');

        return res.status(201).json({ success: true, message: 'Student registered successfully', student: newStudent, token });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Error registering student' });
    }
}

export const loginStudent = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(student._id, 'student');

        return res.status(200).json({ success: true, message: 'Student logged in successfully', student, token });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Error logging in student' });
    }
}

export const getStudent = async (req, res) => {
    try {
        return res.status(200).json({ success: true, student: req.user });
    } catch (error) {
        console.log('Error fetching student:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error fetching student' });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const student = req.user;
        const profilePictureFile = req.files?.profilePicture?.[0];
        const resumeFile = req.files?.resume?.[0];

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const {
            name,
            email,
            phone,
            university,
            major,
            graduationYear,
            bio,
            skills,
            github,
            linkedin,
            portfolio
        } = req.body;

        student.name = name ?? student.name;
        student.email = email ?? student.email;
        student.phone = phone ?? student.phone;
        student.university = university ?? student.university;
        student.major = major ?? student.major;
        student.graduationYear = graduationYear ?? student.graduationYear;
        student.bio = bio ?? student.bio;
        student.github = github ?? student.github;
        student.linkedin = linkedin ?? student.linkedin;
        student.portfolio = portfolio ?? student.portfolio;

        if (skills) {
            const parsedSkills = JSON.parse(skills);

            student.skills = Array.isArray(parsedSkills)
                ? parsedSkills.map(skill => String(skill).trim()).filter(skill => skill.length > 0)
                : student.skills;
        }

        if (profilePictureFile) {
            const uploadResult = await cloudinary.uploader.upload(profilePictureFile.path, {
                folder: 'students/profile_pictures',
                resource_type: 'image',
                allowed_formats: ['jpg', 'jpeg', 'png']
            });
            student.profilePicture = uploadResult.secure_url;
        }

        if (resumeFile) {
            if (!isValidResumeFile(resumeFile)) {
                return res.status(400).json({ success: false, message: 'Only PDF, DOC, or DOCX resume files are allowed' });
            }

            const uploadResult = await cloudinary.uploader.upload(resumeFile.path, {
                folder: 'students/resumes',
                resource_type: 'raw',
                use_filename: true,
                unique_filename: true,
            });
            student.resume = uploadResult.secure_url;
        }

        await student.save();

        return res.status(200).json({ success: true, message: 'Student updated successfully', student });
    } catch (error) {
        console.error('Error updating student:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error updating student' });
    }
}

export const enhanceResumeText = async (req, res) => {
    try {

        const { currentValue } = req.body;

        if (!currentValue) {
            return res.status(400).json({ success: false, message: 'Current value is required' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly and only return text, no options or anything else."
                },
                {
                    role: "user",
                    content: currentValue,
                },
            ],
        });


        return res.status(200).json({ success: true, enhancedValue: response.choices[0].message.content });

    } catch (error) {
        console.error('Error enhancing resume text:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error enhancing resume text' });
    }
} 