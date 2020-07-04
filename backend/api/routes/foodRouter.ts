import { Router } from "express"
import FoodController from "../controllers/foodController"
import * as passport from "passport"

export default class FoodRouter {
    public readonly router: Router;

    constructor(private foodController: FoodController) {
        this.router = Router()
        this.init()
    }

    private init() {
        this.router.post("/intake", passport.authenticate("jwt", { session: false }), (req, res) => { this.foodController.addFood(req, res) })
        this.router.get("/intake/:date", passport.authenticate("jwt", { session: false }), (req, res) => { this.foodController.getNutritionInfo(req, res) })
        this.router.post("/search", passport.authenticate("jwt", { session: false }), (req, res) => { this.foodController.searchFoodDatabase(req, res) })
    }
}
