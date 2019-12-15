const User = require('./../models/User');

class UserService {
    async getUser(userId: string) {
        const user = await User.getOne({_id: userId});
        return user || null;
    }

    async getUserByEmail(email: string) {
        const user = await User.getOne({ email: email });
        return user || null;
    }

    async addUser(userData: {email: string, name?: string}) {
        const user = new User();
        user.email = userData.email;
        user.name = userData.name || userData.email.split('@').shift();
        const saveResult = await user.save();
        return saveResult;
    }
}

module.exports = { UserService }
