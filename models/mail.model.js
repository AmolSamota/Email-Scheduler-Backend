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
        /** 4 values are allowed for scheduleType - Recurring, Weekly, Monthly, Yearly **/
        /** For Recurring  - fix 20 seconds **/
        /** For Weekly set day and time of every */

        body: String,
    },
    { timestamps: true }
);

const Mail = mongoose.model("Mail", mailSchema);

module.exports = Mail;
