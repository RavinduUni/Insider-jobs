import mongoose from "mongoose";

const ndaSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    documentUrl: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ["sent","accepted","rejected"], 
        default: "sent" 
    },
}, { timestamps: true });

const NDA = mongoose.model('NDA', ndaSchema);

export default NDA;