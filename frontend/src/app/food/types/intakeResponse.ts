export interface IntakeResponse {
    success: boolean
    info?: {
        foods: [string]
        quantities: [number]
        nutrients: [string, { value: number, unit: string }]
    }
    message?: string
}