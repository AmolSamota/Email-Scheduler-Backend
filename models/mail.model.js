const mongoose = require("mongoose");
const { Schema } = mongoose;

const mailSchema = new Schema(
    {
        sender: String,
        receivers: [
            {
                type: String,
            },
        ],
        subject: String,
        scheduleType: String,
        /** 4 values are allowed for scheduleType - Recurring, Weekly, Monthly, Yearly */
        /** For Recurring  - fix 30 seconds */
        /** For Weekly we have to set day and time of every week*/
        /** For Monthly we have to set date and time of every Month */
        /** For Yearly we have to set date and time of every Year */
        time: String, // For weekly, monthly, and yearly
        day: String,  // For weekly
        date: Date, // For yearly and monthly
        body: String,
    },
    { 
        timestamps: true 
    }
);

const Mail = mongoose.model("Mail", mailSchema);

module.exports = Mail;
