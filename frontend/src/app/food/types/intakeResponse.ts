export interface IntakeResponse {
    success: boolean
    info?: {
        foods: [string]
        nutrients: [string, { value: number, unit: string }]
    }
    message?: string
}