'use strict';

import { Request, Response, NextFunction } from 'express';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import loginController from './controllers/login.controller';
import userController from './controllers/user.controller';
import authMiddleware from './middlewares/auth.middleware';

dotenv.config();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

mongoose.connect(process.env.DB_URL as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => {
    // App
    const app = express();

    // This should go before all else.
    app.use((req: Request, res: Response, next: NextFunction) => {
      const host = req.get('host');

      // We only care about https for prod site.
      if (!host || !host.match(/^api\.sharky-test\.net/)) {
        next();
        return;
      }

      // Tell the browser that next time it should always use https.
      res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains;');

      if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        // Redirect to https.
        res.redirect('https://' + host + req.url);
      } else {
        // Already https; don't do anything special.
        next();
      }
    });

    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/ping', (req: Request, res: Response) => {
      res.send('OK\n');
    });

    app.use('/login', loginController);

    app.use(authMiddleware);

    app.use('/user', userController);

    app.get('*', (req: Request, res: Response) => {
      res.send('Hello, world!\n');
    });


    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);
  });
