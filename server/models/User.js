// ============================================================
// User Model
// ============================================================
// Stores registered users. The password is automatically hashed
// before saving using a Mongoose pre-save hook + bcryptjs.
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true, // Ensures no duplicate accounts
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
        },
    },
    { timestamps: true } // Adds createdAt & updatedAt automatically
);

// ---- Pre-save hook: hash password before storing ----
// Only runs when the password field is new or modified,
// so updating other fields won't re-hash it.
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ---- Instance method: compare a plain-text password ----
// Used during login to verify credentials.
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
