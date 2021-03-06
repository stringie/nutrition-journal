import { model, Schema, Model, Document } from "mongoose"
import { User } from "../types/user"
import * as bcrypt from "bcrypt"

export interface UserModel extends Document, User {}

export const userSchema: Schema = new Schema({
    username: String,
    password: String,
    email: String
});

userSchema.pre<UserModel>('save', function(next) {
    const salt = 10;
    this.password = bcrypt.hashSync(this.password, salt);
    next()
});

export const UserSchema: Model<UserModel> = model<UserModel>("Users", userSchema)