import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
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
    role: {
        type: String,
        default: "admin"
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
