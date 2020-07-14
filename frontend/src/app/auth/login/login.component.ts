import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { NgForm } from '@angular/forms';
import { LoginResponse } from '../types/loginResponse'
import { AlertService } from 'src/app/alert/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private service: AccountService, private alert: AlertService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    this.service.login(f.controls.username.value, f.controls.password.value).subscribe((response: LoginResponse) => {
      if (response.success) {
        localStorage.setItem("token", response.token)
        this.router.navigate(["/journal"])
      } else {
        this.alert.error(response.message)
      }
    })
  }
}
