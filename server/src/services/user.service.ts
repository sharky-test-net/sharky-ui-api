const User = require('./../models/User');

class UserService {
    async getUser(userId: string) {
        try {
            const user = await User.findOne({ _id: userId });
            return user || null;
        } catch (err) {
            throw err;
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await User.findOne({ email: email });
            return user || null;
        } catch (err) {
            throw err;
        }
    }

    async addUser(userData: { email: string, name?: string }) {
        try {
            const user = new User();
            user.email = userData.email;
            user.name = userData.name || userData.email.split('@').shift();
            const saveResult = await user.save();
            return saveResult;
        } catch (err) {
            throw err;
        }
    }
}

export default new UserService();
