import {Request, Response} from "express"
import {UserModel, UserSchema} from "../../app/schemas/user.schema"

export default class UserController {
    
    public authenticateUser(req: Request, res: Response) {

    }

    public async registerUser(req: Request, res: Response) {
        const user: UserModel = new UserSchema({
            username: req.body.username,
            password: req.body.password
        })

        await user.save();

        return res.send({ success: true, token: ""});
    }
}