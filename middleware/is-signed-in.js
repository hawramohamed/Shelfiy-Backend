const isSignedIn = (req, res, next) => {
    if (!req.user){
        return res.status(401).json({ error: "Authentication required" });
    }
    next();
};

module.exports = isSignedIn;