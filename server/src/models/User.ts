import mongoose from 'mongoose';
import { uuid } from 'uuidv4';

const Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    hardwareToken: string;
}

const UsersSchema = new Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hardwareToken: {
        type: String,
        default: uuid()
    }
});

export default mongoose.model<IUser>('User', UsersSchema);
