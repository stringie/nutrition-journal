import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  constructor(private requestService: RequestService) {}

  public addFood(food: string, url: string, quantity: number) {
    return this.requestService.post('/food', { url, food, quantity });
  }

  public logIntake(food: string, quantity: number) {
    return this.requestService.post('/intake', { food, quantity });
  }

  public getTable() {
    return this.requestService.get('/table');
  }

  public getSuggestions() {
    return this.requestService.get('/suggestion');
  }
}
