import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestService } from './request.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { AlertComponent } from './alert/alert.component';
import { FoodModule } from './food/food.module';

@NgModule({
  declarations: [AppComponent, AlertComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, AuthModule, FoodModule],
  providers: [RequestService],
  bootstrap: [AppComponent]
})
export class AppModule {}
