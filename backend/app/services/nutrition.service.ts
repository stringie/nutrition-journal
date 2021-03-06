import axios from "axios"

export default class NutritionService {
    
    private readonly API_URL_SEARCH = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=P9y7bjDZ1HYXna3KhrMaWeBGPQbz9YOjY4h35Bsc"
    private readonly API_URL_SEARCH_BY_ID = "https://api.nal.usda.gov/fdc/v1/food/###?api_key=P9y7bjDZ1HYXna3KhrMaWeBGPQbz9YOjY4h35Bsc"
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

        const result = {foods: []}

        for (let food of response.data.foods) {
            const foodInfo = {name: food.description, nutrients: [], id: food.fdcId}
            
            for (let nutrient of food.foodNutrients) {
                foodInfo.nutrients.push({name: nutrient.nutrientName, value: nutrient.value, unit: nutrient.unitName})
            }

            result.foods.push(foodInfo)
        }

        return result
    }

    public async searchById(fdcId: string): Promise<any> {
        const response = await axios.get(this.API_URL_SEARCH_BY_ID.replace("###", fdcId))
        
        if (!response) {
            return null
        }

        const foodInfo = {name: response.data.description, nutrients: []}
        
        for (let nutrientInfo of response.data.foodNutrients) {
            foodInfo.nutrients.push({name: nutrientInfo.nutrient.name, value: nutrientInfo.amount ? nutrientInfo.amount : 0, unit: nutrientInfo.nutrient.unitName})
        }
    
        return foodInfo
    }
}