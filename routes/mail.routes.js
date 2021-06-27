const router = require("express").Router();
const mailController = require("../controllers/mail.controller.js");
const { authCheck } = require("../middlewares/auth");

/**
 * API TO ACCESS ALL RECEIVED EMAILS
 */
router.get("/received-emails", authCheck, mailController.getReceivedEmails);

/**
 * API TO ACCESS ALL SENT EMAILS
 */
router.get("/sent-emails", authCheck, mailController.getSentEmails);

/**
 * API TO ACCESS ALL EMAILS TO BE SENT IN FUTURE
 */
router.get(
    "/scheduled-emails",
    authCheck,
    mailController.getEmailsToBeSentInFuture
);

/**
 * API TO SEND A NEW EMAIL
 */
router.post("/send-email", authCheck, mailController.sendEmail);

/**
 * API TO CHANGE SCHEDULE TYPE OF A EMAIL
 */
// router.post(
//     "/change-scheduler-type",
//     authCheck,
//     mailController.updateScheduleType
// );

module.exports = router;
