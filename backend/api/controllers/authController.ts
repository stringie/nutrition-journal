import { Request, Response, NextFunction } from "express";
import passport from "passport"

export default class AuthController {
    public authenticateJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", (err, user, info) => {
            if (err || !user) {
                res.send({
                    success: false,
                    message: "unauthorized"
                })
            }
        })
    }
}