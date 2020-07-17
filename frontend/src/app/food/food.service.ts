import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private readonly FOOD_ROUTE = "foods"

  constructor(private request: RequestService) { }

  public getIntake(date: string) {
    return this.request.get(`/${this.FOOD_ROUTE}/intake/${date}`)
  }

  public addIntake(date: string, fdcId: number, quantity: number) {
    return this.request.post(`/${this.FOOD_ROUTE}/intake/${date}`, { fdcId, quantity })
  }

  public search(food: string) {
    return this.request.post(`/${this.FOOD_ROUTE}/search`, { food })
  }
}
