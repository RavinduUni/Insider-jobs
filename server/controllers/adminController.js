import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import Project from '../models/Project.js';
import Application from '../models/Application.js';
import NDA from '../models/NDA.js';
import Admin from '../models/Admin.js';
import Review from '../models/Review.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

const deleteCloudinaryFile = async (url) => {
    if (!url) return;
    try {
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) return;

        // Determine resource_type from the URL segment before 'upload'
        // e.g. /image/upload, /raw/upload, /video/upload
        const resourceType = parts[uploadIndex - 1] || 'image';

        // Skip optional version segment (v123456)
        let startIndex = uploadIndex + 1;
        if (/^v\d+$/.test(parts[startIndex])) startIndex++;

        // Join remaining segments and strip file extension to get public_id
        const withExt = parts.slice(startIndex).join('/');
        const publicId = withExt.replace(/\.[^/.]+$/, '');

        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Cloudinary delete error for URL', url, ':', error.message);
    }
};

// Register admin
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.json({ success: false, message: 'Admin already exists with this email' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword
        });
        
        await newAdmin.save();
        
        const token = jwt.sign({ userId: newAdmin._id, role: newAdmin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Authenticate admin (Optional but good to have)
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        res.json({ success: true, admin });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const studentsCount = await Student.countDocuments();
        const recruitersCount = await Recruiter.countDocuments();
        const projectsCount = await Project.countDocuments();
        const applicationsCount = await Application.countDocuments();
        const ndasCount = await NDA.countDocuments();

        // Recent activity
        const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5).populate('recruiter', 'name companyName');
        const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            success: true,
            stats: {
                students: studentsCount,
                recruiters: recruitersCount,
                projects: projectsCount,
                applications: applicationsCount,
                ndas: ndasCount
            },
            recentActivity: {
                projects: recentProjects,
                students: recentStudents
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json({ success: true, students });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) return res.json({ success: false, message: 'Student not found' });

        await deleteCloudinaryFile(student.profilePicture);
        await deleteCloudinaryFile(student.resume);
        
        const applications = await Application.find({ studentId: id });
        
        for (const app of applications) {
            await deleteCloudinaryFile(app.cvUrl);
            await deleteCloudinaryFile(app.projectPlanUrl);

            const ndas = await NDA.find({ applicationId: app._id });
            for (const nda of ndas) {
                await deleteCloudinaryFile(nda.documentUrl);
            }
            await NDA.deleteMany({ applicationId: app._id });
        }
        
        await Application.deleteMany({ studentId: id });
        
        await Review.deleteMany({ studentId: id });

        await Student.findByIdAndDelete(id);

        res.json({ success: true, message: 'Student and related records deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Recruiters
export const getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await Recruiter.find().select('-password');
        res.json({ success: true, recruiters });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteRecruiter = async (req, res) => {
    try {
        const { id } = req.params;
        await Recruiter.findByIdAndDelete(id);
        res.json({ success: true, message: 'Recruiter deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('recruiter', 'name companyName email');
        res.json({ success: true, projects });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Applications
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('studentId', 'name email')
            .populate('projectId', 'title status');
        res.json({ success: true, applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// NDAs
export const getAllNDAs = async (req, res) => {
    try {
        const ndas = await NDA.find()
            .populate({
                path: 'applicationId',
                populate: [
                    { path: 'studentId', select: 'name email' },
                    { path: 'projectId', select: 'title' }
                ]
            });
        res.json({ success: true, ndas });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
