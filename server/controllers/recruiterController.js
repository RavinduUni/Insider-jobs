import Recruiter from "../models/Recruiter.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import Project from "../models/Project.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import Application from "../models/Application.js";
import NDA from "../models/NDA.js";

export const sendEmailVerificationOtp = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const otp = generateOtp();

        await sendOtpEmail(email, otp, name);
        return res.status(200).json({ success: true, message: 'OTP sent to email', otp });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error sending OTP email' });
    }
}

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
        console.error('Error registering recruiter:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error registering recruiter' });
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
        console.error('Error logging in recruiter:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error logging in recruiter' });
    }
}

export const getRecruiter = async (req, res) => {
    try {
        return res.status(200).json({ success: true, recruiter: req.user });
    } catch (error) {
        console.error('Error fetching recruiter:', error);
        return res.status(500).json({ success: false, message: 'Error fetching recruiter' });
    }
};

export const updateRecruiter = async (req, res) => {
    try {
        const recruiter = req.user;

        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter not found' });
        }

        const {
            name,
            companyName,
            email,
            contactNumber,
            industry,
            companySize,
            location,
            bio,
            hiringFor,
            hiringfor,
            companyWebsite,
            companyLinkedin,
            companyTwitter
        } = req.body;

        recruiter.name = name ?? recruiter.name;
        recruiter.companyName = companyName ?? recruiter.companyName;
        recruiter.email = email ?? recruiter.email;
        recruiter.contactNumber = contactNumber ?? recruiter.contactNumber;
        recruiter.industry = industry ?? recruiter.industry;
        recruiter.companySize = companySize ?? recruiter.companySize;
        recruiter.location = location ?? recruiter.location;
        recruiter.bio = bio ?? recruiter.bio;
        recruiter.companyWebsite = companyWebsite ?? recruiter.companyWebsite;
        recruiter.companyLinkedin = companyLinkedin ?? recruiter.companyLinkedin;
        recruiter.companyTwitter = companyTwitter ?? recruiter.companyTwitter;

        const hiringForPayload = hiringFor ?? hiringfor;
        if (hiringForPayload) {
            const parsedHiringFor = JSON.parse(hiringForPayload);

            recruiter.hiringFor = Array.isArray(parsedHiringFor)
                ? parsedHiringFor.map(role => String(role).trim()).filter(Boolean)
                : [String(parsedHiringFor).trim()].filter(Boolean);
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'recruiters/companyLogos',
                allowed_formats: ['jpg', 'jpeg', 'png']
            });
            recruiter.companyLogo = result.secure_url;
        }

        await recruiter.save();

        return res.status(200).json({ success: true, message: 'Recruiter updated successfully', recruiter });

    } catch (error) {
        console.error('Error updating recruiter:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error updating recruiter' });
    }
}


export const createProject = async (req, res) => {
    try {

        const recruiter = req.user;

        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter not found' });
        }

        const {
            title,
            category,
            description,
            budget,
            deadline,
            technologies,
            requirements,
            deliverables
        } = req.body;

        if (!title || !category || !description || !budget || !deadline || !technologies || !requirements || !deliverables) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const newProject = new Project({
            title,
            category,
            description,
            budget,
            deadline,
            technologies: technologies.map(tech => String(tech).trim()).filter(Boolean),
            requirements: requirements.map(req => String(req).trim()).filter(Boolean),
            deliverables: deliverables.map(del => String(del).trim()).filter(Boolean),
            recruiter: recruiter._id
        });

        await newProject.save();

        return res.status(201).json({ success: true, message: 'Project created successfully', project: newProject });

    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ success: false, message: error.message || 'Error creating project' });
    }
}


export const getAllApplicationsForProject = async (req, res) => {
    try {
        const recruiter = req.user;

        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter not found' });
        }

        const projectIds = await Project.find({ recruiter: recruiter._id }).select('_id');

        const applications = await Application.find({ projectId: { $in: projectIds } })
            .populate('studentId', 'name email skills university major graduationYear profilePicture')
            .populate('projectId', 'title description budget deadline technologies createdAt')
            .populate('ndaId', 'documentUrl status createdAt');

        return res.status(200).json({ success: true, applications });
    } catch (error) {
        console.error('Error fetching applications for project:', error);
        return res.status(500).json({ success: false, message: 'Server error while fetching applications' });
    }
}

export const sendNDA = async (req, res) => {
    let ndaPublicId = null;
    try {
        const recruiter = req.user;
        const ndaDocument = req.file ? req.file.path : null;
        const { applicationId } = req.body;

        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Unauthorized' });
        }

        if (!applicationId || !ndaDocument) {
            return res.status(400).json({ success: false, message: 'Application ID and NDA document are required' });
        }

        const application = await Application.findById(applicationId).populate('projectId');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (String(application.projectId.recruiter) !== String(recruiter._id)) {
            return res.status(403).json({ success: false, message: 'You are not authorized to send NDA for this application' });
        }

        const existingNDA = await NDA.findOne({ applicationId });

        if (existingNDA) {
            return res.status(400).json({ success: false, message: 'NDA already exists for this application' });
        }

        const result = await cloudinary.uploader.upload(ndaDocument, {
            folder: 'ndas',
            allowed_formats: ['pdf', 'doc', 'docx'],
            use_filename: true,
            unique_filename: true
        });
        ndaPublicId = result.public_id;

        const newNDA = new NDA({
            applicationId,
            documentUrl: result.secure_url,
            ndaStatus: 'nda_sent'
        });
        await newNDA.save();

        application.ndaId = newNDA._id;
        application.status = 'nda_sent';
        await application.save();

        return res.status(200).json({ success: true, message: 'NDA sent successfully', application, nda: newNDA });

    } catch (error) {
        console.error('Error sending NDA:', error);
        if (ndaPublicId) {
            try {
                await cloudinary.uploader.destroy(ndaPublicId);
            }
            catch (cleanupError) {
                console.error('Error cleaning up NDA document from Cloudinary:', cleanupError);
            }
        }
        return res.status(500).json({ success: false, message: 'Server error while sending NDA' });
    }
}

export const getAllNDAs = async (req, res) => {
    try {
        const recruiter = req.user;

        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter not found' });
        }

        const projectIds = await Project.find({ recruiter: recruiter._id }).select('_id');

        const applications = await Application.find({ projectId: { $in: projectIds } }).select('_id');

        const ndaList = await NDA.find({ applicationId: { $in: applications } })
            .populate({ path: 'applicationId', populate: { path: 'studentId', select: 'name email university' } })
            .populate({ path: 'applicationId', populate: { path: 'projectId', select: 'title' } });
        
        return res.status(200).json({ success: true, ndas: ndaList });
    } catch (error) {
        console.error('Error fetching NDAs:', error);
        return res.status(500).json({ success: false, message: 'Server error while fetching NDAs' });
    }
}