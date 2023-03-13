'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */

exports.authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name }});
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`${user.emailAddress} has ben authenticated.`);
                req.currentUser = user;
            } else {
                message = `${user.emailAddress} has not been authenticated.`;
            }
        } else {
            message = `${credentials.name} not found.`;
        }
    } else {
        message = `Auth header not found`;
    }
    if (message) {
        console.warn(message);
        res.status(401).json({ message: `Access Denied`});
    } else {
        next();
    }
};