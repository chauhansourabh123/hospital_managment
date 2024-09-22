import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const messageSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'First name should contain at least 3 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [3, 'Last name should contain at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email address",
          },
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        minlength: [10, 'Phone number must contain exactly 10 digits'],
        maxlength: [10, 'Phone number must contain exactly 10 digits'],
        match: [/^\d{10}$/, 'Phone number must contain exactly 10 digits'] // Regex to ensure exactly 10 digits
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        minlength: [10, 'Message should contain at least 10 characters']  // Adjusted to characters; consider word count if needed
    }
});

// Create a model based on the schema
const Message = mongoose.model('Message', messageSchema);

export default Message;
