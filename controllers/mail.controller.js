const Mail = require("../models/mail.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

/**
 * SERVICE TO SEND A NEW EMAIL
 */
const sendEmail = async (req, res, next) => {
    const senderEmail = req.user.email;
    const sender = await User.findOne({ email: senderEmail });

    const payload = req.body;
    const { receivers } = payload;

    // creating the receiver id array
    const receiversEmailAddress = receivers.split(",");
    const receiversIdArray = [];
    for (let email of receiversEmailAddress) {
        const receiver = await User.findOne({ email: email });
        receiversIdArray.push(receiver._id);
    }
    console.log("REceiver id", receiversIdArray);
    try {
        const mail = new Mail({
            _id: new mongoose.Types.ObjectId(),
            sender: sender._id,
            receivers: receiversIdArray,
            subject: payload.subject,
            scheduleType: payload.scheduleType,
            scheduleTime: payload.scheduleTime,
            body: payload.body,
            // day: payload.day,
            // date: payload.date,
            // time: payload.time,
        });
        await mail.save(async function (err) {
            if (err) return next(err);

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
            },
        });
        const filteredEmails = [];
        console.log("user", user.sentEmails);
        const sentEmails = user.sentEmails;

        const timeNow = new Date();
        for (let email of sentEmails) {
            /**
             * 2. compare the timestamp of email with current time
             * and push emails having time less than current time
             * in filterted emails
             */
            console.log("ecreatedAt", email.createdAt, "now", timeNow);
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
        const user = await User.findOne({ email: emailAddress });
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
        const sentEmails = user.sentEmails;
        const filteredEmails = [];
        for (let email of sentEmails) {
            /**
             * 2. compare the timestamp of email with current time
             * and push emails having time greater than current time
             * in filterted emails
             */
        }
        res.json(filteredEmails);
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
