import { Router, Request, Response } from "express";
import FoodController from "../controllers/foodController";

export default class FoodRouter {
    public readonly router: Router;

    constructor(private foodController: FoodController) {
        this.router = Router()
        this.init()
    }

    private init() {
        this.router.post("/intake", (req, res) => {
            this.foodController.addFood
        });
        this.router.get("/{date}", (req, res) => {
            this.foodController.getNutritionInfo
        });
        this.router.get("/search", (req, res) => {
            this.foodController.searchFoodDatabase
        });
    }
}
