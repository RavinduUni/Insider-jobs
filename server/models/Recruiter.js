import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    companyLogo: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    industry: {
        type: String,
    },
    companySize: {
        type: String,
    },
    location: {
        type: String,
    },
    bio: {
        type: String,
    },
    companyWebsite: {
        type: String,
    },
    companyLinkedin: {
        type: String,
    },
    companyTwitter: {
        type: String,
    }
}, { timestamps: true });

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
export default Recruiter;