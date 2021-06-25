const User = require("../models/user.model.js");

const createOrUpdateUser = async (req, res) => {
    const { name, email, picture } = req.user;
    // save the user in db
    const user = await User.findOneAndUpdate(
        { email: email },
        { name: name, picture: picture },
        {
            new: true,
            useFindAndModify: false,
        }
    );
    if (!user) {
        const user = await User.create({
            email: email,
            name: name,
            picture: picture,
        });
    }
    res.json({ user });
};

const currentUser = (req, res) => {
    User.findOne({ email: req.user.email }, (err, user) => {
        if (err) res.json(err);
        else res.json({ user });
    });
};

module.exports = { 
    createOrUpdateUser, 
    currentUser 
};
