import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { NgForm } from '@angular/forms';
import { LoginResponse } from '../types/loginResponse'
import { AlertService } from 'src/app/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private service: AccountService, private alert: AlertService) { }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    this.service.login(f.controls.username.value, f.controls.password.value).subscribe((response: LoginResponse) => {
      if (response.success) {
        localStorage.setItem("token", response.token)
      } else {
        this.alert.error(response.message)
      }
    })
  }
}
