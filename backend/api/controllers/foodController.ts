import { Request, Response } from "express";
import { DailyIntakeSchema } from "../../app/schemas/daily-intake.schema";
import NutritionService from "../../app/services/nutrition.service";

export default class FoodController {
    
    constructor(private nutritionService: NutritionService) {}

    public async addFood(req: Request, res: Response) {
        const food: string = req.body.food
        const quantity: number = Number(req.body.quantity)
        const date = new Date(req.body.date)
        const fdcId = req.body.fdcId

        const dailyIntake = await DailyIntakeSchema.findOne({ date: date })
        const foodInfo = await this.nutritionService.searchById(fdcId)

        for (let f of foodInfo) {
            dailyIntake.foods.push(f.name)
            for (let nutrient of f.nutrients) {
                const n = dailyIntake.nutrients[nutrient.name]
                dailyIntake.nutrients[nutrient.name] = { value: n.value + nutrient.value, unit: nutrient.unit}
            }
        }

        await dailyIntake.save()
        
        res.send({
            success: true
        })
    }

    public async getNutritionInfo(req: Request, res: Response) {
        const date = new Date(req.body.date)

        const dailyIntake = await DailyIntakeSchema.findOne({ date: date })
        if (dailyIntake) {
            res.send({
                success: true,
                info: dailyIntake
            })
        } else {
            res.send({
                success: false
            })
        }
    }

    public async searchFoodDatabase(req: Request, res: Response) {
        const searchResult = await this.nutritionService.search(req.body.food)

        if (searchResult) {
            res.send({
                success: true,
                result: searchResult
            })
        } else {
            res.send({
                success: false
            })
        }
    }
}