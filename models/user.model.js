const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const userSchema = new Schema(
    {
        name: String,
        email: {
            type: String,
            required: true,
            index: true,
        },
        sentEmails: [
            {
                type: ObjectId,
                ref: "Mail",
            },
        ],
        receivedEmails: [
            {
                type: ObjectId,
                ref: "Mail",
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
