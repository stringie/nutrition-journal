import { Component, OnInit } from '@angular/core';
import { FoodService } from '../food.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { IntakeResponse } from '../types/intakeResponse';
import { AlertService } from 'src/app/alert/alert.service';
import { IntakeInfo } from '../types/intakeInfo';
import { AccountService } from 'src/app/auth/account.service';
import { acceptedNutrients, nutrinentRequirements } from './nutrients'
import { repeat } from 'rxjs/operators';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
  public date: NgbDateStruct 
  public foods: [string]
  public quantities: [number]
  public nutrients: (string | { value: number, unit: string })[]

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
        this.nutrients = response.info.nutrients.filter(n => acceptedNutrients.includes(n[0]))
        this.quantities = response.info.quantities
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

  public applyProgress() {
    if (this.nutrients) {
      for ( const n of this.nutrients ) {
        const elem = document.getElementById(n[0])
        if (elem) {
  
          const index = acceptedNutrients.findIndex(x => x == n[0])
          const requirement = nutrinentRequirements[index]
          const dv = (n[1].value / requirement) * 100
  
          elem.style.width = dv + '%';
          elem.style.backgroundColor = `rgb(${255 * (1 - dv / 100)}, ${(255 * dv) / 100}, 0)`;
        }
      }
    }
  }
}
