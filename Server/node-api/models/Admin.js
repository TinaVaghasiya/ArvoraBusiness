import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ["superadmin", "usermanager", "cardmanager"],
        default: "user_manager"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordOTPExpiresAt: {
        type: Date,
        default: null
    }
}, { timestamps: true 
});

adminSchema.pre('save', async function() {
    if (!this.isModified('password')) return ;
    try {
        const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error(error);
    }  
})

adminSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

adminSchema.methods.toJSON = function() {
    const admin = this.toObject();
    delete admin.password;
    return admin;
}

export default mongoose.model("Admin", adminSchema);