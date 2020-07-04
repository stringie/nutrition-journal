import { Router } from "express";
import UserController from "../controllers/userController";

export default class UserRouter {
    public readonly router: Router;

    constructor(private userController: UserController) {
        this.router = Router()
        this.init()
    }

    private init() {
        this.router.post("/login", (req, res) => { this.userController.authenticateUser(req, res) })
        this.router.post("/register", (req, res) => { this.userController.registerUser(req, res) })
    }
}
