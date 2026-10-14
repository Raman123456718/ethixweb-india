import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
  phone: { type: String, trim: true, maxlength: 20, default: '' },
  company: { type: String, trim: true, maxlength: 150, default: '' },
  service: { type: String, required: true, trim: true, maxlength: 100 },
  budget: { type: String, trim: true, maxlength: 80, default: '' },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 3000 },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Closed'], default: 'New' }
}, { timestamps: true });

export default mongoose.model('Enquiry', enquirySchema);