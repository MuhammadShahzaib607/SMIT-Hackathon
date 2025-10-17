import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            status: false,
            message: "Token missing or invalid"
        });
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Token expired or invalid",
            error: error.message
        });
    }

}