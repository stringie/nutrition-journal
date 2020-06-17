import { Router, Request, Response } from "express";
import Scraper from "../app/services/scraping.service";
import { NutritionTableSchema } from "../app/schemas/nutrition-table.schema";
import { DailyIntakeSchema, DailyIntakeModel } from "../app/schemas/daily-intake.schema";
import { NutritionTable } from "../app/types/nutrition-table";

export default class FoodsRouter {
    public readonly router: Router;

    constructor(private scraper: Scraper) {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.post("/food", (req, res) => {
            this.food(req, res);
        });
        this.router.post("/intake", (req, res) => {
            this.intake(req, res);
        });
        this.router.get("/table", (req, res) => {
            this.table(req, res);
        });
        this.router.get("/suggestion", (req, res) => {
            this.suggest(req, res);
        });
        this.router.post("/script", (req, res) => {
            this.script();
        });
    }

    private async food(req: Request, res: Response) {
        const food = await NutritionTableSchema.findOne({ food: req.body.food });

        if (food) {
            res.send({
                success: true,
                message: "Table already exists"
            });
        } else {
            await this.scraper.load(req.body.url);
            const table = await this.scraper.getNutritionTable();

            for (const nutrient of Array.from(table.entries())) {
                table.set(nutrient[0], {
                    value: nutrient[1].value.valueOf() / req.body.quantity,
                    dv: nutrient[1].dv.valueOf() / req.body.quantity
                });
            }

            const nutrients = new NutritionTableSchema({
                nutrients: table,
                food: req.body.food
            });
            await nutrients.save();

            res.send({
                success: true
            });
        }
    }

    private async intake(req: Request, res: Response) {
        const nutritionTable: NutritionTable = await NutritionTableSchema.findOne({ food: req.body.food });

        if (!nutritionTable) {
            res.send({
                message: "Please add " + req.body.food + " in the database first"
            });
        } else {
            const today = new Date();

            const todayIntake: DailyIntakeModel = (await DailyIntakeSchema.find().sort({ $natural: -1 }))[0];

            const adjustedNutrients = nutritionTable.nutrients;
            for (const nutrient of Array.from(adjustedNutrients.entries())) {
                const adjustedDV = nutrient[1].dv * req.body.quantity;
                const adjustedValue = nutrient[1].value * req.body.quantity;

                adjustedNutrients.set(nutrient[0], { value: adjustedValue, dv: adjustedDV });
            }

            if (!todayIntake || (todayIntake.date.getDate() < today.getDate() && today.getDate() != 1)) {
                const newDay = new DailyIntakeSchema({
                    nutrients: adjustedNutrients,
                    foods: [req.body.food],
                    date: today
                });

                await newDay.save();
            } else {
                for (const nutrient of Array.from(adjustedNutrients.entries())) {
                    if (!todayIntake.nutrients.has(nutrient[0])) {
                        todayIntake.nutrients.set(nutrient[0], nutrient[1]);
                    } else {
                        const todayNutrientValues = todayIntake.nutrients.get(nutrient[0]);

                        todayIntake.nutrients.set(nutrient[0], {
                            value: nutrient[1].value + todayNutrientValues.value,
                            dv: nutrient[1].dv + todayNutrientValues.dv
                        });
                    }
                }

                todayIntake.foods.push(req.body.food);

                await todayIntake.save();
            }

            res.send({
                success: true
            });
        }
    }

    private async table(req: Request, res: Response) {
        const table = (await DailyIntakeSchema.find().sort({ $natural: -1 }))[0];

        const today = new Date();

        if (
            !table ||
            (table.date.getDate() !== today.getDate() && table.date.getMonth() != today.getMonth())
        ) {
            res.send({
                success: false
            });
        } else {
            res.send({
                success: true,
                table: table
            });
        }
    }

    private async suggest(req: Request, res: Response) {
        const table = (await DailyIntakeSchema.find().sort({ $natural: -1 }))[0];
        const today = new Date();

        if (
            !table ||
            (table.date.getDate() !== today.getDate() && table.date.getMonth() != today.getMonth())
        ) {
            res.send({
                success: false
            });
        } else {
            let suggestions = {};

            for (const nutrient of Array.from(table.nutrients.entries())) {
                if (this.determine(nutrient[1].dv)) {
                    const query = {};
                    query[`nutrients.${nutrient[0]}.dv`] = -1;
                    const maxK = (await NutritionTableSchema.find().sort(query))[0];

                    suggestions[nutrient[0]] = maxK.food;
                }
            }

            res.send({
                suggestions: suggestions
            });
        }
    }

    private determine(dv: number) {
        return dv < 75;
    }

    private async script() {
        const tables = await NutritionTableSchema.find();

        for (const table of tables) {
            for (const nutrient of Array.from(table.nutrients.entries())) {
                table.nutrients.set(nutrient[0], {
                    value: nutrient[1].value.valueOf() / table.mass,
                    dv: nutrient[1].dv.valueOf() / table.mass
                });
            }

            await table.save();
        }
    }
}
