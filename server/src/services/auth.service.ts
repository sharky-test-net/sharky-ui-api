const clientID = process.env.GITHUB_APP_CLIENT_ID as string;
const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET as string;
const jwtSecret = process.env.SHARKY_JWT_SECRET as string;

import axios from 'axios';
import jwt from 'jsonwebtoken';

export interface AuthInfo {
    token: string;
    email: string;
    name: string;
}

class AuthService {
    getEmailFromGithub(code: string): Promise<AuthInfo> {
        return axios
            .post(
                'https://github.com/login/oauth/access_token',
                {
                    client_id: clientID,
                    client_secret: clientSecret,
                    code: code,
                    accept: 'json'
                },
                {
                    headers: { "X-Requested-With": "XMLHttpRequest" }
                }
            )
            .then(githubRes => {
                if (githubRes && githubRes.data && githubRes.data.access_token) {
                    return githubRes.data.access_token;
                } else {
                    throw new Error(githubRes.data.error);
                }
            })
            .then(accessToken => axios.get('https://api.github.com/user?access_token=' + accessToken))
            .then(userInfo => {
                console.log(userInfo.data.email);
                return {
                    token: jwt.sign({ email: userInfo.data.email }, jwtSecret),
                    email: userInfo.data.email,
                    name: userInfo.data.email.split('@').shift()
                };
            })
    }
}

export default new AuthService()
