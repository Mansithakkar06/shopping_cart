import jwt from "jsonwebtoken"
export const optionalJWT = async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;
        
        if (!token && (req.headers.authorization || req.headers.Authorization)) {
            const authHeader = req.headers.authorization || req.headers.Authorization;
            token = authHeader.replace(/^Bearer\s+/i, "");
        }

        if (!token) {
            return next();
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (!err && user) {
                req.userId = user.id;
            }
            next();
        });
    } catch (error) {
        next();
    }
}