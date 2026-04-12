import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true  
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    university: {
        type: String,
    },
    major: {
        type: String,
    },
    graduationYear: {
        type: Number,
    },
    bio: {
        type: String,
    },
    skills: {
        type: [String],
    },
    profilePicture: {
        type: String,
    },
    resume: {
        type: String,
    },
    github: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    portfolio: {
        type: String,
    },
    appliedProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }],
    isEmailVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;