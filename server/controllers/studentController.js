import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";

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

        let resumeUrl = '';
        if (resume) {
            const uploadResult = await cloudinary.uploader.upload(resume, {
                folder: 'students/resumes',
                resource_type: 'raw',
                allowed_formats: ['pdf', 'doc', 'docx']
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
        return res.status(500).json({success: false, message: 'Error registering student' });
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
        return res.status(500).json({success: false, message: 'Error logging in student' });
    }
}