export interface DailyIntake {
    nutrients: Map<string, { value: number, unit: string }>
    foods: [string]
    quantities: [number]
    date: Date
}