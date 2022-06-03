import jwt from "jsonwebtoken";

const secret = '9b47b99918f5a505abcb661bdf328ec08a834e19';
const expiresTime = 1800;

function sign(payload) {
    return jwt.sign(payload, secret, { expiresIn: expiresTime});
}

async function verify(token) {
    return jwt.verify(token, secret);
}

export { sign, verify };