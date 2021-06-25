require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { readdirSync } = require("fs");

const app = express();

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
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server running on http://localhost:" + port);
});
