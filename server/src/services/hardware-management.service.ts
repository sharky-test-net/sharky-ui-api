
import User from './../models/User';
import { uuid } from 'uuidv4';

class HardwareManagementService {
    async getHardwareToken(userId: string) {
        try {
            const user = await User.findOne({ _id: userId });
            return user && user.hardwareToken || null;
        } catch (err) {
            throw err;
        }
    }

    async replaceHardwareToken(userId: string) {
        try {
            const user = await User.findOne({ _id: userId });
            if(!user) {
                throw new Error('User not found');
            }
            const newToken = uuid();
            user.hardwareToken = newToken;
            await user.save()
            return { token: newToken };
        } catch (err) {
            throw err;
        }
    }
}

export default new HardwareManagementService();
