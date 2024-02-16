const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

exports.signup = (req, res, next) => {
    const password = req.body.password;
    console.log("password is : " + password);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
        console.log("______" + passwordRegex.test(password));
        return res.status(400).json({
            message: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
    }
    
    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "User created successfully!" }))
                .catch(error => res.status(500).json({ error: "Error saving user." }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found!' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Incorrect password!' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET', 
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => {
                    console.error("Error comparing passwords:", error);
                    res.status(500).json({ error: "Internal server error" });
                });
        })
        .catch(error => {
            console.error("Error finding user:", error);
            res.status(500).json({ error: "Internal server error" });
        });
};
