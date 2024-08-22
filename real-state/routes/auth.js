const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, 'secret');
        console.log('token: ',token);
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // const token = jwt.verify({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.status(200).json({
            msg: 'Login successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error',err });
    }
});

module.exports = router;
