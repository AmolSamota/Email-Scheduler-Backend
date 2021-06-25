const Mail = require("../models/mail.model");

/**
 * SERVICE TO SEND A NEW EMAIL
 */
const sendEmail = async (req, res, next) => {
    try {
    } catch (error) {
        res.json(next(error));
    }
};

/**
 * SERVICE TO ACCESS ALL SENT EMAILS BY USERNAME
 */
const getSentEmails = async (req, res, next) => {
    try {
    } catch (error) {
        res.json(next(error));
    }
};

/**
 * SERVICE TO ACCESS ALL RECEIVED EMAILS BY USERNAME
 */
const getReceivedEmails = async (req, res, next) => {
    try {
    } catch (error) {
        res.json(next(error));
    }
};

/**
 * SERVICE TO ACCESS ALL EMAILS TO BE SENT IN FUTURE BY USERNAME
 */
const getEmailsToBeSentInFuture = async (req, res, next) => {
    try {
    } catch (error) {
        res.json(next(error));
    }
};
