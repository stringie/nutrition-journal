import { Request, Response } from "express";
import { DailyIntakeSchema, DailyIntakeModel } from "../../app/schemas/daily-intake.schema";
import NutritionService from "../../app/services/nutrition.service";
import { Schema } from "mongoose";

export default class FoodController {
    
    constructor(private nutritionService: NutritionService) {}

    public async addFood(req: Request, res: Response) {
        const fdcId = req.body.fdcId
        const quantity: number = Number(req.body.quantity)
        const date = new Date(req.params.date)

        const food = await this.nutritionService.searchById(fdcId)
        
        if (!food) {
            return res.send({
                success: false,
                message: "Food id invalid"
            })
        }

        let dailyIntake: DailyIntakeModel = await DailyIntakeSchema.findOne({ date: date })


        if (!dailyIntake) {
            dailyIntake = new DailyIntakeSchema({
                foods: [],
                nutrients: new Map(),
                date: date
            })
        }

        dailyIntake.foods.push(food.name)
        for (let nutrient of food.nutrients) {
            const prevValue = dailyIntake.nutrients.has(nutrient.name) ? dailyIntake.nutrients.get(nutrient.name).value : 0
            dailyIntake.nutrients.set(nutrient.name, { value: prevValue + (nutrient.value * quantity) / 100, unit: nutrient.unit })
        }

        await dailyIntake.save()
        
        res.send({
            success: true
        })
    }

    public async getNutritionInfo(req: Request, res: Response) {
        
        const date = new Date(req.params.date)

        const dailyIntake = await DailyIntakeSchema.findOne({ date: date })
        if (dailyIntake) {
            res.send({
                success: true,
                info: dailyIntake
            })
        } else {
            res.send({
                success: false,
                message: "Nothing to show on: " + date.toDateString()
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