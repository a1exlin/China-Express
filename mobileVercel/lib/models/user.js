import mongoose from "mongoose"
import crypto from "crypto"

// Define the schema for users
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  hashedPassword: {
    type: String,
    required: [true, "Please provide a password"],
  },
  salt: {
    type: String,
    required: true,
  },
  isFirstAdmin: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Method to set password
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex")
  this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex")
}

// Method to validate password
userSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex")
  return this.hashedPassword === hash
}

// Method to generate reset token
userSchema.methods.generateResetToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex")

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  // Set expire time - 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

// Create or retrieve the model
const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User
