import express, { Request, Response, NextFunction } from 'express';

import userService from './../services/user.service';
import authService from './../services/auth.service';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.code) {
        try {
            const gitHubEmail = await authService.getEmailFromGithub(req.query.code);
            let user = await userService.getUserByEmail(gitHubEmail);
            if (!user) {
                const userInfo = {
                    email: gitHubEmail
                };
                user = await userService.addUser(userInfo);
            }
            const token = authService.getAuthToken({email: user.email});
            const authInfo = {
                token,
                email: user.email,
                name: user.name
            };
            res.send(authInfo);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.msg || err.message || err.error || err);
        };
    }
});

module.exports = router;
