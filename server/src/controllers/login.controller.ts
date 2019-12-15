import express, { Request, Response, NextFunction } from 'express';

import authService from './../services/auth.service'

const router = express.Router();

const User = require('./../models/User');

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.code) {
        try {
            const authInfo = await authService.getEmailFromGithub(req.query.code);
            res.send(authInfo);
        } catch (err) {
            res.status(500).send(err);
        };
    }
});

module.exports = router;
