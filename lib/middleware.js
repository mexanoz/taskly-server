import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
    const token = req.cookies.taskly_token;
    if (!token) {
        return next({ status: 401, message: "Unauthorized" });
    }
    jwt.verify(token, process.env.AUTH_SECRET, (err, user) => {
        if (err) {
            return next({ status: 403, message: "Forbidden" });
        }
        req.user = user;
        next();
    });
}

export function errorHandler(err, req, res, next) {
    const defaultMessage = "An error has occurred, sorry.";
    const { status, message, error } = err;
    if (error) {
        console.error(error);
    }
    return res.status(status).json({ message: message || defaultMessage });
}
