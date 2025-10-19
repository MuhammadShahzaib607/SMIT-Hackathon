import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
    // Report ki tasveer ka URL (jo Multer se upload hokar Cloudinary/S3/ya DB URL mein save hoga)
    imageUrl: { type: String, required: true }, 
    // AI se analyze hone ke baad ka result
    analysisText: { type: String, default: 'Pending analysis.' }, 
    // Report upload ki date
    uploadedAt: { type: Date, default: Date.now },
});

const FamilyMemberSchema = new mongoose.Schema({
    // Yeh member kis user ka hai
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Family member ka naam
    name: { type: String, required: true, trim: true },
    // Unki saari reports
    reports: [ReportSchema],
    // Chat history yahan bhi rakh sakte hain ya alag collection mein.
    // Simple rakhte hue, filhal reports mein hi focus karein.
    
}, { timestamps: true });

export default mongoose.model('FamilyMember', FamilyMemberSchema);