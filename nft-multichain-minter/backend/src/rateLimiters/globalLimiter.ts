import rateLimit from "express-rate-limit";

const globalLimiter = rateLimit({
    windowMs: 60 *1000,
    max: 80,
    message:{error: "TOo many request, try again later"}
});

export default globalLimiter;