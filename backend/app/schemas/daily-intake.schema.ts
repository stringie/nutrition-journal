import { model, Schema, Model, Document } from "mongoose"
import { DailyIntake } from "../types/daily-intake";

export interface DailyIntakeModel extends Document, DailyIntake {}

const dailyIntakeSchema: Schema = new Schema({
    nutrients: {
        type: Map,
        of: { value: Number, dv: Number }
    },
    foods: [String],
    date: Date
});

export const DailyIntakeSchema: Model<DailyIntakeModel> = model<DailyIntakeModel>("DailyIntake", dailyIntakeSchema);