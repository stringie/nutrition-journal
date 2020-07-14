import {Request, Response} from "express"
import {UserModel, UserSchema} from "../../app/schemas/user.schema"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"

export default class UserController {
    public async authenticateUser(req: Request, res: Response) {
        let user: UserModel = await UserSchema.findOne({ username: req.body.username })

        if (user) {
            const success = await bcrypt.compare(req.body.password, user.password)

            if (success) {
                const token = jwt.sign({ username: user.username }, "secret", { expiresIn: "10m" })

                res.send({
                    success: true,
                    token: token
                })
            } else {
                res.send({
                    success: false,
                    message: "Invalid password"
                })
            }
        } else {
            res.send({
                success: false,
                message: "Invalid username"
            })
        }
    }

    public async registerUser(req: Request, res: Response) {
        let user: UserModel = await UserSchema.findOne({ username: req.body.username })

        if (!user) {
            user = new UserSchema({
                username: req.body.username,
                password: req.body.password
            })
    
            await user.save()

            res.send({
                success: true 
            });
        } else {
            res.send({
                success: false,
                message: "User already exists"
            })
        }
    }
}