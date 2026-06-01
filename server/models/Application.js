import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    cvUrl: {
        type: String,
        required: true
    },
    projectPlanUrl: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["applied","selected","rejected", "assigned"], 
        default: "applied" 
    },
    ndaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NDA'
    }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;