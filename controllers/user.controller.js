const User = require("../models/user.model.js");

const createUser = async (req, res) => {
    const { name, email } = req.user;
    // save the user in db
    const user = await User.findOne({ email: email });
    if (!user) {
        const user = await User.create({
            email: email,
            name: name,
        });
    }
    res.json(user);
};

module.exports = {
    createUser,
};
