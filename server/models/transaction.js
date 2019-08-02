const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    sender_walletId: { type: String, required: true, trim: true },
    reciever_walletId: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0.0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", transactionSchema);
