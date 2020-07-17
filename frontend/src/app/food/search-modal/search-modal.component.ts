import { Component, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FoodService } from '../food.service';
import { SearchResponse } from '../types/searchResponse';
import { AlertService } from 'src/app/alert/alert.service';
import { IntakeInfo } from '../types/intakeInfo';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss']
})
export class SearchModalComponent {
  public food: string
  public quantity: number
  public selectedFoodNutrients: [{ name: string, value: number, unit: string }]
  public selectedFoodId: number
  public foods: [{ name: string, nutrients: [{ name: string, value: number, unit: string }], id: number }]

  @Output() messageEvent = new EventEmitter<IntakeInfo>();

  constructor(private modalService: NgbModal, private service: FoodService, private alert: AlertService) {}

  public open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'search-modal', size: "lg", scrollable: true})
  }

  public searchFood() {
    delete this.selectedFoodNutrients
    delete this.selectedFoodId
    if (this.food.length > 3) {
      this.service.search(this.food).subscribe( (response: SearchResponse) => {
        if (response.success) {
          this.foods = response.result.foods
        } else {
          this.alert.error(response.message)
        }
      })
    }
  }

  public selectFood(food: string) {
    const selectedFood = this.foods.find(f => f.name == food)
    this.selectedFoodId = selectedFood.id
    this.selectedFoodNutrients = selectedFood.nutrients
  }

  public sendId() {
    this.messageEvent.emit({ fdcId: this.selectedFoodId, quantity: this.quantity })
    this.modalService.dismissAll()
  }
}
