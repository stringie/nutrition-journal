import { Router, Request, Response } from "express";
import FoodController from "../controllers/foodController";

export default class FoodRouter {
    public readonly router: Router;

    constructor(private foodController: FoodController) {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.post("/foods/intake", (req, res) => {
            this.foodController.addFood
        });
        this.router.get("/foods/{date}", (req, res) => {
            this.foodController.getNutritionInfo
        });
        this.router.get("/foods/search", (req, res) => {
            this.foodController.searchFoodDatabase
        });
    }
}
