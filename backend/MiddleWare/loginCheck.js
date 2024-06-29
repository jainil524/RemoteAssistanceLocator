const jwt = require('jsonwebtoken');


let loginCheck = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({ status: 'error', error: 'login required! Please login' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        if( error.name === 'TokenExpiredError' ){
            res.status(400).json({ status: 'error', error: 'Invalid Token or expired' });
        }
        else{
            res.status(400).json({ status: 'error', error: 'Invalid Token' });
        }
    }
}

module.exports = loginCheck;