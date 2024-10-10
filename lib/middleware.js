export function errorHandler(err, req, res, next) {
    const defaultMessage = "An error has occurred, sorry.";
    const { status, message, error } = err;
    if (error) {
        console.error(error);
    }
    return res.status(status).json({ message: message || defaultMessage });
}
