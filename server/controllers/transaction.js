const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const { sendOtp } = require("../utils/otp");

module.exports = {
  transferFund: async (req, res, next) => {
    const senderId = req.body.sender_walletId;
    const receiverId = req.body.receiver_walletId;
    let amount = req.body.amount;
    const pin = req.body.pin;

    if (senderId === receiverId)
      return res
        .status(400)
        .json({ message: "Cannot transfer to same account" });

    //verify that the the ids exist
    const sender = await User.findOne({ walletId: senderId });
    const receiver = await User.findOne({ walletId: receiverId });

    if (!sender || !receiver)
      return res.status(400).json({ message: "Invalid sender or receiver Id" });

    //validate pin
    const isMatch = await bcrypt.compare(pin, sender.pin);

    //ensure sender has enough balance to make this transaction
    let senderBalance = sender.balance;
    if (isMatch && senderBalance >= amount) {
      //send otp
      sendOtp({
        walletId: senderId,
        phoneNumber: sender.phoneNumber
      });
      //save the unfulfilled transaction to transaction table
      const transactionDetails = await Transaction.create({
        sender_walletId: senderId,
        receiver_walletId: receiverId,
        amount
      });

      res.status(200).json({
        message:
          "Please enter the otp sent to your mobile number to complete this transaction",
        transactionDetails
      });
    } else {
      res.status(400).json({
        message: "You don't have enough funds to complete this transaction"
      });
    }
  },

  completeTransaction: async (req, res, next) => {
    const { transId, otp } = req.body;

    const transaction = await Transaction.findById(transId);
    const amount = transaction.amount;

    const sender = await User.findOne({
      walletId: transaction.sender_walletId
    });
    const receiver = await User.findOne({
      walletId: transaction.receiver_walletId
    });

    //compare sender otp and tranaction otp
    if (!transaction || otp !== sender.otp)
      return res.status(400).json({ message: "Invalid transaction ID or OTP" });

    let senderBalance = sender.balance;
    let receiverBalance = receiver.balance;

    if (senderBalance >= amount) {
      senderBalance -= amount;
      receiverBalance += amount;

      await User.findOneAndUpdate(
        { walletId: transaction.sender_walletId },
        { balance: senderBalance, otp: "" }
      );
      await User.findOneAndUpdate(
        { walletId: transaction.receiver_walletId },
        { balance: receiverBalance }
      );
      await Transaction.findOneAndUpdate(
        { _id: transId },
        { status: "completed" }
      );

      res.status(200).json({
        message: "Fund transfer completed successfully!"
      });
    } else {
      res.status(400).json({
        message: "You don't have enough funds to complete this transaction"
      });
    }
  },

  history: async (req, res, next) => {
    const { walletId } = req.params;
    const sent = await Transaction.find({ sender_walletId: walletId });
    const recieved = await Transaction.find({ receiver_walletId: walletId });
    const data = [...sent, ...recieved];

    res.status(200).json({ message: "Transaction history", data });
  }
};
