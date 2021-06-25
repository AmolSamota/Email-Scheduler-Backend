const router = require("express").Router;
const mailController = require("../controllers/mail.controller.js");
const { authCheck } = require("../middlewares/auth");

/**
 * API TO ACCESS ALL RECEIVED EMAILS
 */
router.get(
    "/received-emails/:name",
    authCheck,
    mailController.getReceivedEmails
);

/**
 * API TO ACCESS ALL SENT EMAILS
 */
router.get("/sent-emails/:name", authCheck, mailController.getSentEmails);

/**
 * API TO ACCESS ALL EMAILS TO BE SENT IN FUTURE
 */
router.get(
    "/future-sent-emails/:name",
    authCheck,
    mailController.getEmailsToBeSentInFuture
);

/**
 * API TO SEND A NEW EMAIL
 */
router.post("/send-mail", authCheck, mailController.sendEmail);
