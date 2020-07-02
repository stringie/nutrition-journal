export interface DailyIntake {
    nutrients: Map<string, { value: number, unit: string }>;
    foods: [string];
    date: Date;
}