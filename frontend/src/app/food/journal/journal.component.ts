import { Component, OnInit } from '@angular/core';
import { FoodService } from '../food.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { IntakeResponse } from '../types/intakeResponse';
import { AlertService } from 'src/app/alert/alert.service';
import { IntakeInfo } from '../types/intakeInfo';
import { AccountService } from 'src/app/auth/account.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
  public date: NgbDateStruct 
  public foods: [string]
  public nutrients: [string, { value: number, unit: string }]

  constructor(private service: FoodService, private calendar: NgbCalendar, private alert: AlertService, private auth: AccountService) { }

  ngOnInit() {
    this.date = this.calendar.getToday()
    this.fetchFoods()
  }

  public fetchFoods() {
    delete this.foods
    delete this.nutrients
    this.service.getIntake(`${this.date.year}-${this.date.month}-${this.date.day}`).subscribe((response: IntakeResponse) => {
      if (response.success) {
        this.foods = response.info.foods
        this.nutrients = response.info.nutrients
      } else {
        this.alert.error(response.message, { autoClose: true })
      }
    })
  }

  public addFood(info: IntakeInfo) {
    this.service.addIntake(`${this.date.year}-${this.date.month}-${this.date.day}`, info.fdcId, info.quantity).subscribe((response) => {
      if (!response.success) {
        this.alert.error(response.message)
      } else {
        this.fetchFoods()
      }
    })
  }

  public logout() {
    this.auth.logout()
  }
}
