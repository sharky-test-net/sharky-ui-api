import { IUser } from './../models/User';
import express, { Request, Response, NextFunction } from 'express';

import userService from './../services/user.service';
import authService from './../services/auth.service';
import hardwareManagementService from '../services/hardware-management.service';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.email) {
            const email = req.query.email;
            const user = await userService.getUserByEmail(email, { _id: 0, __v: 0 });
            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.send(user);
            }
        } else {
            res.status(400).send('User email has to be provided')
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.msg || err.message || err.error || err);
    };
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.email) {
            const email = req.body.email;
            const user = await userService.getUserByEmail(email);
            if (!user) {
                res.status(404).send('User not found');
            } else {
                user.name = req.body.name;
                await user.save();
                res.send(user);
            }
        } else {
            res.status(400).send('User email has to be provided')
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.msg || err.message || err.error || err);
    };
});

router.get('/token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.email) {
            const email = req.query.email;
            const user = await userService.getUserIdByEmail(email);
            if (!user) {
                res.status(404).send('User not found');
            } else {
                const token = await hardwareManagementService.getHardwareToken(user._id);
                res.send(token);
            }
        } else {
            res.status(400).send('User email has to be provided')
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.msg || err.message || err.error || err);
    };
});

router.post('/token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.email) {
            const email = req.body.email;
            const user = await userService.getUserIdByEmail(email);
            if (!user) {
                res.status(404).send('User not found');
            } else {
                const newToken = await hardwareManagementService.replaceHardwareToken(user._id);
                res.send(newToken);
            }
        } else {
            res.status(400).send('User email has to be provided')
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.msg || err.message || err.error || err);
    };
});

export default router;
