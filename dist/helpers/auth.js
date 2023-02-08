"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromToken = exports.verifyAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAuthToken = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).send('No credentials sent!');
        return;
    }
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        res.set('Authorization', authorizationHeader);
        next();
    }
    catch (error) {
        res.status(401).send(`invalid token ${error}`);
    }
};
exports.verifyAuthToken = verifyAuthToken;
const getUserIdFromToken = (req, res) => {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
    //@ts-ignore
    return decoded.user.id;
};
exports.getUserIdFromToken = getUserIdFromToken;
