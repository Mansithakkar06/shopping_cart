import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;
        
        // Fallback to Authorization header if cookie is missing (e.g. cross-site third-party cookie restrictions)
        if (!token && (req.headers.authorization || req.headers.Authorization)) {
            const authHeader = req.headers.authorization || req.headers.Authorization;
            token = authHeader.replace(/^Bearer\s+/i, "");
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized! No token provided." })
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized! Invalid or expired token.' });
            }
            req.userId = user.id;
            next();
        });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
}