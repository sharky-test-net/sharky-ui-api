import User from './../models/User';

class UserService {
    async getUserById(userId: string) {
        try {
            const user = await User.findOne({ _id: userId }).select({ _id: 0, __v: 0 });
            return user || null;
        } catch (err) {
            throw err;
        }
    }

    async getUserByEmail(email: string, select?: object) {
        try {
            const user = await User.findOne({ email: email })
                .select(select || { __v: 0 });
            return user || null;
        } catch (err) {
            throw err;
        }
    }

    async getUserIdByEmail(email: string) {
        try {
            const user = await User.findOne({ email: email }).select({ _id: 1 });;
            return user || null;
        } catch (err) {
            throw err;
        }
    }

    async addUser(userData: { email: string, name?: string }) {
        try {
            const user = new User();
            user.email = userData.email;
            user.name = userData.name || `${userData.email.split('@').shift()}`;
            const saveResult = await user.save();
            return saveResult;
        } catch (err) {
            throw err;
        }
    }
}

export default new UserService();
