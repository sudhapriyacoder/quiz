const jwt = require('jsonwebtoken');

const authCheck = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodeToken.userId;
        req.body.userId = userId;
        next();
    } catch (error) {
        res.status(401).send({
            message: 'You are not authenticated',
            data: error,
            success: false
        })
    }
}

module.exports = authCheck;