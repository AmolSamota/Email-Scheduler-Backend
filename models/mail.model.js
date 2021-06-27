const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const mailSchema = new Schema(
    {
        sender: { type: ObjectId, ref: "User" },
        receivers: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        subject: String,
        body: String,

        /** 4 values are allowed for scheduleType - Recurring, Weekly, Monthly, Yearly */
        /** For Recurring  - fix 30 seconds */
        /** For Weekly we have to set day and time of every week*/
        /** For Monthly we have to set date and time of every Month */
        /** For Yearly we have to set date and time of every Year */
        scheduleType: String,
        scheduleDate: Date,
        // time: String, // For weekly, monthly, and yearly
        // day: String, // For weekly
        // date: Date, // For yearly and monthly
    },
    {
        timestamps: true,
    }
);

const Mail = mongoose.model("Mail", mailSchema);

module.exports = Mail;
