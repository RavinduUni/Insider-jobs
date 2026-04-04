import Recruiter from "../models/Recruiter.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";

export const registerRecruiter = async (req, res) => {
    try {

        const { name, companyName, email, password } = req.body;

        const companyLogo = req.file ? req.file.path : '';

        if (!name || !companyName || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const isExistingRecruiter = await Recruiter.findOne({ email });

        if (isExistingRecruiter) {
            return res.status(400).json({ success: false, message: 'Recruiter already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        let companyLogoUrl = '';

        if (companyLogo) {
            const result = await cloudinary.uploader.upload(companyLogo, {
                folder: 'recruiters/companyLogos',
                allowed_formats: ['jpg', 'jpeg', 'png']
            });
            companyLogoUrl = result.secure_url;
        }

        const newRecruiter = new Recruiter({
            name,
            companyName,
            email,
            password: hashedPassword,
            companyLogo: companyLogoUrl
        });

        await newRecruiter.save();

        const token = generateToken(newRecruiter._id, 'recruiter');

        return res.status(201).json({ success: true, message: 'Recruiter registered successfully', recruiter: newRecruiter, token });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error registering recruiter' });
    }
}

export const loginRecruiter = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const recruiter = await Recruiter.findOne({ email });

        if (!recruiter) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, recruiter.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(recruiter._id, 'recruiter');

        return res.status(200).json({ success: true, message: 'Recruiter logged in successfully', recruiter, token });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error logging in recruiter' });
    }
}