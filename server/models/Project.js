import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    technologies: {
        type: [String],
        required: true,
    },
    requirements: {
        type: [String],
        required: true,
    },
    deliverables: {
        type: [String],
        required: true,
    },
    status: {
        type: String,
        enum: ['open','has applicants','in progress', 'completed'],
        default: 'open',
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true,
    }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;