# Email-Scheduler-Backend API

-   _GET_ : /api/received-emails - Get all emails received by user, ie, Inbox

-   _GET_ : /api/sent-emails - Get all email sent by user, ie, Outbox

-   _GET_ : /api/scheduled-emails - Get all emails scheduled for future for not send to receiver yet

-   _POST_ : /api/send-email - Sends a email. Required subject,body,receivers,scheduleType and scheduleDate in request body

# Working

A cron job runs after each 30s, which check if the scheduled mail time is less than current time, if it is, then it add the mail to receiver's receivedEmails and sender's sentEmails and create new Mail scheduled for future.

# Requirements for starting the project

## .env file

-   PORT=port no
-   MONGODB_USER=mongo_user_name
-   MONGODB_PASSWORD=your_mongo_db_password

## Also a serviceAccountKey.json file is setup in firebase folder, which provides authentication to users.

For starting the project,

-   npm install
-   npm start
