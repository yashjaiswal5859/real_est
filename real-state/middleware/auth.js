const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'secret');
        console.log(decoded);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;
