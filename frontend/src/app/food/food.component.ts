import { Component, OnInit } from '@angular/core';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {
  private name: string;
  private url: string;
  private eaten: string;
  private quantity: number;
  private table: { nutrient: string; content: { value: number; dv: number } }[];
  private foods: [string];
  private suggestions: any[];

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.onRefresh();
  }

  onFood() {
    this.foodService.addFood(this.name, this.url, this.quantity).subscribe(value => {
      console.log(value);
    });
  }

  onIntake() {
    this.foodService.logIntake(this.eaten, this.quantity).subscribe(value => {
      console.log(value);
    });

    this.applyProgress();
  }

  onRefresh() {
    this.foodService.getTable().subscribe(value => {
      this.foods = value.table.foods;

      this.table = Object.keys(value.table.nutrients).map(v => {
        return {
          nutrient: v,
          content: value.table.nutrients[v]
        };
      });
    });
  }

  applyProgress() {
    for (const row of this.table) {
      const elem = document.getElementById(row.nutrient);
      elem.style.width = row.content.dv + '%';
      elem.style.backgroundColor = `rgb(${255 * (1 - row.content.dv / 100)}, ${(255 * row.content.dv) /
        100}, 0)`;
    }
  }

  onSuggest() {
    this.foodService.getSuggestions().subscribe(value => {
      this.suggestions = Object.entries(value.suggestions).map(v => {
        return v[0] + ' -> ' + v[1];
      });
    });

    this.applyProgress();
  }
}
