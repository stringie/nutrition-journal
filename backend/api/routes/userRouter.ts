import { Router, Request, Response } from "express";
import UserController from "../controllers/userController";
import AuthController from "../controllers/authController";

export default class UserRouter {
    public readonly router: Router;

    constructor(private userController: UserController, private authController: AuthController) {
        this.router = Router()
        this.init()
    }

    private init() {
        this.router.post("/login", this.userController.authenticateUser)
        this.router.post("/register", this.userController.registerUser)
    }
}
