const auth = (req, res, next) => {
    // logic for auth middleware
    // return res.status(200).send("Authentication successful");
    console.log("Auth middleware called");
    next();
}

module.exports = { auth };