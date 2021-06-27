const Mail = require("../models/mail.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

/**
 * SERVICE TO SEND A NEW EMAIL
 */
const sendEmail = async (req, res, next) => {
    try {
        const senderEmail = req.user.email;
        const sender = await User.findOne({ email: senderEmail });

        const payload = req.body;
        const { receivers, scheduleType, scheduleDate, subject, body } =
            payload;

        // creating the receiver id array
        const receiversEmailAddress = receivers.split(",");
        const receiversIdArray = [];
        for (let email of receiversEmailAddress) {
            const receiver = await User.findOne({ email: email });
            receiversIdArray.push(receiver._id);
        }
        // console.log("REceiver id", receiversIdArray);

        const mail = new Mail({
            _id: new mongoose.Types.ObjectId(),
            sender: sender._id,
            receivers: receiversIdArray,
            subject: subject,
            scheduleType: scheduleType,
            scheduleDate: scheduleDate,
            body: body,
        });
        await mail.save(async function (err) {
            if (err) return next(err);

            if (scheduleType === null) {
                // fill sentEmails of sender user
                // const sender = await User.findOne({ email: senderEmail });
                // console.log("sender", sender);
                sender.sentEmails.push(mail);
                await sender.save();

                // fill receivedEmails of receiver user
                for (let email of receiversEmailAddress) {
                    // console.log("emil", email);
                    const receiver = await User.findOne({ email: email });
                    // console.log("receiver", receiver);
                    receiver.receivedEmails.push(mail);
                    await receiver.save();
                }
                res.json("Mail Added to DB And sent to receivers");
            } else {
                res.json("Email scheduled");
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * SERVICE TO ACCESS ALL SENT EMAILS BY USERNAME
 */
const getSentEmails = async (req, res, next) => {
    try {
        const emailAddress = req.user.email;
        const user = await User.findOne({ email: emailAddress }).populate({
            path: "sentEmails",
            populate: {
                path: "receivers",
                select: ["name", "email"],
            },
        });
        const filteredEmails = [];
        // console.log("user", user.sentEmails);
        const sentEmails = user.sentEmails;

        const timeNow = new Date();
        for (let email of sentEmails) {
            /**
             * 2. compare the timestamp of email with current time
             * and push emails having time less than current time
             * in filterted emails
             */
            // console.log("ecreatedAt", email.createdAt, "now", timeNow);
            if (email.createdAt < timeNow) {
                filteredEmails.push(email);
            }
        }
        res.json(filteredEmails);
    } catch (error) {
        next(error);
    }
};

/**
 * SERVICE TO ACCESS ALL RECEIVED EMAILS BY USERNAME
 */
const getReceivedEmails = async (req, res, next) => {
    try {
        const emailAddress = req.user.email;
        const user = await User.findOne({ email: emailAddress })
            .populate({
                path: "receivedEmails",
                populate: {
                    path: "sender",
                    select: "name email",
                },
            })
            .populate({
                path: "receivedEmails",
                populate: {
                    path: "receivers",
                    select: "email name",
                },
            });

        res.json(user.receivedEmails);
    } catch (error) {
        next(error);
    }
};

/**
 * SERVICE TO ACCESS ALL EMAILS TO BE SENT IN FUTURE BY USERNAME
 */
const getEmailsToBeSentInFuture = async (req, res, next) => {
    try {
        /**
         * 1. Get all sent emails of the user by username
         */
        const emailAddress = req.user.email;
        const user = await User.findOne({ email: emailAddress });
        console.log("user", user);

        // const find scheduled emails
        const scheduledMailsForUser = await Mail.find({
            sender: user._id,
            scheduleType: { $ne: null },
        }).populate({
            path: "receivers",
            select: "email name",
        });
        // const sentEmails = user.sentEmails;
        const filteredEmails = [];
        for (let email of scheduledMailsForUser) {
            /**
             * 2. compare the timestamp of email with current time
             * and push emails having time greater than current time
             * in filterted emails
             */
        }
        res.json(scheduledMailsForUser);
    } catch (error) {
        next(error);
    }
};

/**
 * SERVICE TO UPDATE THE SCHEDULE TYPE OF EMAIL
 */
const updateScheduleType = async (req, res, next) => {
    try {
    } catch (error) {
        res.json(next(error));
    }
};

module.exports = {
    sendEmail,
    getSentEmails,
    getReceivedEmails,
    getEmailsToBeSentInFuture,
    updateScheduleType,
};
