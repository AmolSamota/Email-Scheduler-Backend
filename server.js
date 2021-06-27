require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { readdirSync } = require("fs");
const errorHandler = require("./middlewares/errorHandler");
const cron = require("node-cron");

const app = express();

// models
const Mail = require("./models/mail.model");
const User = require("./models/user.model");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// connecting to DB
mongoose.connect(
    `mongodb+srv://emailscheduleruser:${process.env.MONGODB_PASSWORD}@cluster0.bfjnv.mongodb.net/emailScheduler`,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("DB CONNECTED");
    // autoload routes
    readdirSync("./routes").map((filename) =>
        app.use("/api", require("./routes/" + filename))
    );
    app.use(errorHandler);

    // start cron job
    cron.schedule("*/10 * * * * *", () => {
        console.log("running every 30s");
        sendingScheduledMails();
    });
});

// check mails collection after every 30s to check for scheduled mails
const sendingScheduledMails = async () => {
    // finding all scheduled mails and sending it to receivers
    const allScheduledMails = await Mail.find({ scheduleType: { $ne: null } });
    console.log(allScheduledMails);
    for (mail of allScheduledMails) {
        // send mail if the scheduled time has reached
        if (mail.scheduleDate < new Date()) {
            console.log("email scheduled");

            // set new schedule date , on which it is send again
            let newScheduleDate = new Date(mail.scheduleDate);
            if (mail.scheduleType === "recurring") {
                newScheduleDate = new Date(newScheduleDate.getTime() + 30000);
            } else if (mail.scheduleType === "weekly") {
                newScheduleDate.setDate(newScheduleDate.getDate() + 7);
            } else if (mail.scheduleType === "monthly") {
                newScheduleDate.setDate(newScheduleDate.getDate() + 30);
            } else {
                newScheduleDate.setDate(newScheduleDate.getDate() + 365);
            }

            // constructing new mail object
            const newMail = new Mail({
                _id: new mongoose.Types.ObjectId(),
                sender: mail.sender._id,
                receivers: mail.receivers,
                subject: mail.subject,
                scheduleType: mail.scheduleType,
                scheduleDate: newScheduleDate,
                body: mail.body,
            });
            await newMail.save();

            // finding the mail to be updated
            const requiredMail = await Mail.findOne({ _id: mail._id });
            // finding the receiver and updating his receivedEMails
            for (let receiverId of requiredMail.receivers) {
                const receiver = await User.findOne({ _id: receiverId });
                receiver.receivedEmails.push(mail._id);
                await receiver.save();
            }
            // update the sender's sentEmails
            const sender = await User.findOne({ _id: mail.sender });
            sender.sentEmails.push(mail._id);
            await sender.save();

            // turn this mail's schedule to null as it is already sent
            requiredMail.scheduleType = null;
            requiredMail.scheduleDate = null;
            await requiredMail.save();
        }
    }
};

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server running on http://localhost:" + port);
});
