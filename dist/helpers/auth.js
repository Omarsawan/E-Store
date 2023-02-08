'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
exports.getUserIdFromToken = exports.verifyAuthToken = void 0;
var jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
var verifyAuthToken = function (req, res, next) {
  if (!req.headers.authorization) {
    res.status(403).send('No credentials sent!');
    return;
  }
  try {
    var authorizationHeader = req.headers.authorization;
    var token = authorizationHeader.split(' ')[1];
    jsonwebtoken_1['default'].verify(token, process.env.TOKEN_SECRET);
    res.set('Authorization', authorizationHeader);
    next();
  } catch (error) {
    res.status(401).send('invalid token '.concat(error));
  }
};
exports.verifyAuthToken = verifyAuthToken;
var getUserIdFromToken = function (req, res) {
  var authorizationHeader = req.headers.authorization;
  var token = authorizationHeader.split(' ')[1];
  var decoded = jsonwebtoken_1['default'].verify(
    token,
    process.env.TOKEN_SECRET
  );
  //@ts-ignore
  return decoded.user.id;
};
exports.getUserIdFromToken = getUserIdFromToken;
