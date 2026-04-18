import mongoose from "mongoose";

const ndaSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    documentUrl: {
        type: String,
        required: true
    },
    ndaStatus: { 
        type: String, 
        enum: ["nda_sent","accepted","rejected","assigned"], 
        default: "nda_sent" 
    },
}, { timestamps: true });

const NDA = mongoose.model('NDA', ndaSchema);

export default NDA;