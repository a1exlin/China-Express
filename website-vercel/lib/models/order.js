import mongoose from "mongoose"

// Define the schema for order items
const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
})

// Define the schema for orders
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["credit-card", "paypal", "cash"],
    default: "credit-card",
  },
  paymentIntentId: {
    type: String,
    default: null,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  orderType: {
    type: String,
    enum: ["delivery", "pickup"],
    default: "delivery",
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "ready", "out-for-delivery", "delivered", "cancelled"],
    default: "pending",
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  estimatedDeliveryTime: {
    type: Date,
  },
})

// Create or retrieve the model
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default Order
