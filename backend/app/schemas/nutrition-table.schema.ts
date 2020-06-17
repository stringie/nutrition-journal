import { model, Schema, Document, Model } from "mongoose";
import { NutritionTable } from "../types/nutrition-table";

export interface NutritionTableModel extends Document, NutritionTable {}

const nutritionTableSchema: Schema = new Schema({
    nutrients: {
        type: Map,
        of: { value: Number, dv: Number }
    },
    food: String,
    mass: Number
});

export const NutritionTableSchema: Model<NutritionTableModel> = model<NutritionTableModel>(
    "NutritionTable",
    nutritionTableSchema
);
