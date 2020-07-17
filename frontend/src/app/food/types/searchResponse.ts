export interface SearchResponse {
    success: boolean
    message?: string
    result?: { foods: [{ name: string, nutrients: [{ name: string, value: number, unit: string }], id: number }]}
}