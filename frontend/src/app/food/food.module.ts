import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FoodRoutingModule } from './food-routing.module';
import { JournalComponent } from './journal/journal.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { SearchModalComponent } from './search-modal/search-modal.component';

@NgModule({
  declarations: [JournalComponent, SearchModalComponent],
  imports: [
    CommonModule,
    FoodRoutingModule,
    NgbModule,
    FormsModule
  ]
})
export class FoodModule { }
