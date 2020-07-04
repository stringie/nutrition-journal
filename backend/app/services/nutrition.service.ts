import axios from "axios"

export default class NutritionService {
    
    private readonly API_URL_SEARCH = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY"
    private readonly API_URL_SEARCH_BY_ID = "https://api.nal.usda.gov/fdc/v1/food/###?api_key=DEMO_KEY"
    private readonly PAGE_SIZE = 10

    public async search(food: string): Promise<any> {
        const query = {
            query: food,
            dataType: [
              "Foundation",
              "SR Legacy"
            ],
            pageSize: this.PAGE_SIZE,
            pageNumber: 1,
            sortBy: "dataType.keyword",
            sortOrder: "desc"
        }

        const response = await axios.post(this.API_URL_SEARCH, query)

        return this.transformResponse(response)
    }

    public async searchById(fdcId: string): Promise<any> {
        const response = await axios.get(this.API_URL_SEARCH_BY_ID.replace("###", fdcId))

        return this.transformResponse(response)
    }

    private transformResponse(response: any) {
        const result = {foods: []}

        for (let food of response.data.foods) {
            const foodInfo = {name: food.description, nutrients: []}
            
            for (let nutrient of food.foodNutrients) {
                foodInfo.nutrients.push({name: nutrient.nutrientName, value: nutrient.value, unit: nutrient.unitName})
            }

            result.foods.push(foodInfo)
        }

        return result
    }
}