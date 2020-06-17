export interface NutritionTable {
    nutrients: Map<string, { value: number; dv: number }>;
    food: string;
    mass: number;
}
