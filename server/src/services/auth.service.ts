import jwt from 'jsonwebtoken';
import axios from 'axios';

class AuthService {
    getEmailFromGithub(code: string): Promise<string> {
        return axios
            .post(
                'https://github.com/login/oauth/access_token',
                {
                    client_id: process.env.GITHUB_APP_CLIENT_ID as string,
                    client_secret: process.env.GITHUB_APP_CLIENT_SECRET as string,
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
            .then(userInfo => userInfo.data.email)
    }

    getAuthToken(payload: Object) {
        return jwt.sign(payload, process.env.SHARKY_JWT_SECRET as string);
    }
}

export default new AuthService()
