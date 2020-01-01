import { Request, Response, NextFunction } from 'express';
import  jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(403).end();
        return;
    }
    const token = auth.split(' ').pop() as string;
    try {
        jwt.verify(token, process.env.SHARKY_JWT_SECRET as string);
        next();
    }
    catch (err) {
        console.log(err);
        res.status(403).end();
    }
};
