import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function issueJwt(wallet: string){
    return jwt.sign(
        {wallet},
        JWT_SECRET,
        {expires: "2h"}
    );
}

export function veerifyJwt(token: string){
    return jwt.verify(token, JWT_SECRET);
}