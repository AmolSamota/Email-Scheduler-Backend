const Mail = require("../models/mail.model");
const User = require("../models/user.model");

/**
 * SERVICE TO SEND A NEW EMAIL
 */
const sendEmail = async (req, res, next) => {
    try {
        const payload = req.body;
        const mail = new Mail({
            sender: payload.sender,
            receivers: payload.receivers,
            subject: payload.subject,
            scheduleType: payload.scheduleType,
            body: payload.body,
            day: payload.day,
            date: payload.date,
            time: payload.time
        });
        await mail.save();
        const sender = await User.find({name: payload.sender});
        sender.sentEmails.push(mail);
        await sender.save();
        for (let name of mail.receivers) {
            const receiver = await User.find({name});
            receiver.receivedEmails.push(mail);
            await receiver.save();
        }
        res.json("Mail Added to DB And sent to receivers");
    } catch (error) {
        res.json(next(error));
    }
};

/**
 * SERVICE TO ACCESS ALL SENT EMAILS BY USERNAME
 */
const getSentEmails = async (req, res, next) => {
    try {
        const username = req.params.name;
        const user = await User.find({name: username});
        res.json(user.sentEmails);
    } catch (error) {
        res.json(next(error));
    }
};

/**
 * SERVICE TO ACCESS ALL RECEIVED EMAILS BY USERNAME
 */
const getReceivedEmails = async (req, res, next) => {
    try {
        const username = req.params.name;
        const user = await User.find({name: username});
        res.json(user.receivedEmails);
    } catch (error) {
        res.json(next(error));
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
        const username = req.params.name;
        const user = await User.find({name: username});
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
        res.json(next(error));
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
    updateScheduleType
}
