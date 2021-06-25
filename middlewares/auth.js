const admin = require("../firebase/index");

const authCheck = (req, res, next) => {
    const idToken = req.headers.authorization.split(" ")[1];
    // idToken comes from the client app
    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            next();
        })
        .catch((error) => {
            // Handle error
            console.log(error);
            res.status(401).json({ error: "Invalid or expired token" });
        });
};

module.exports = {
    authCheck,
};
