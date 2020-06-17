export interface DailyIntake {
    nutrients: Map<string, { value: number, dv: number }>;
    foods: [string];
    date: Date;
}