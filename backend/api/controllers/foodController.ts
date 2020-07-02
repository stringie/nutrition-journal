import { Request, Response } from "express";
import { DailyIntakeSchema } from "../../app/schemas/daily-intake.schema";

export default class FoodController {
    
    constructor(private nutritionService: NutritionService) {}

    public async addFood(req: Request, res: Response) {
        const food: string = req.body.food
        const quantity: number = Number(req.body.quantity)
        const date = new Date(req.body.date)

        const dailyIntake = await DailyIntakeSchema.findOne({ date: date })
        dailyIntake.foods.push(food)
        
    }

    public async getNutritionInfo(req: Request, res: Response) {
        const date = new Date(req.body.date)

        const dailyIntake = await DailyIntakeSchema.findOne({ date: Date })
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

    public searchFoodDatabase(req: Request, res: Response) {

    }
}