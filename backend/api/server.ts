import * as http from "http";
import * as mongoose from "mongoose";
import * as express from "express";
import App from "./app";
import FoodRouter from "./routes/foodRouter";
import UserRouter from "./routes/userRouter";
import FoodsController from "./controllers/foodController";
import UserController from "./controllers/userController"
import NutritionService from "../app/services/nutrition.service";
import AuthController from "./controllers/authController";

export default class Server {

    private app: express.Application;

    public async run() {
        this.initDB()
        await this.initServer()
    }

    private async initDB(): Promise<void> {
        await mongoose.connect("mongodb://admin:admin@mongo:27017/whf?authSource=admin", { useNewUrlParser: true } , err => {
            if (err) {
                throw err
            }
            console.log("Mongo connected")
        });
    }

    private async initServer() {
        const nutritionService = new NutritionService()

        const authController = new AuthController()
        const foodController = new FoodsController(nutritionService)
        const userController = new UserController()

        const foodRouter = new FoodRouter(foodController)
        const userRouter = new UserRouter(userController, authController)

        this.app = new App(foodRouter, userRouter).app
        this.app.set("port", 3000)
        
        const server = http.createServer(this.app)

        server.listen(3000);
        server.on("listening", this.onListening)
        server.on("error", this.onError)
    }

    private onError(error: NodeJS.ErrnoException): void {
        console.log(error)
    }
    
    private onListening(): void {
        console.log("Listening....")
    }
}