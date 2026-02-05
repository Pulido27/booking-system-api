"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var env_js_1 = require("../config/env.js");
var generateToken = function (payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.env.JWT_SECRET, {
        expiresIn: env_js_1.env.JWT_EXPIRES_IN,
    });
};
exports.generateToken = generateToken;
var verifyToken = function (token) {
    try {
        var decoded = jsonwebtoken_1.default.verify(token, env_js_1.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null; // Token inválido o expirado
    }
};
exports.verifyToken = verifyToken;
