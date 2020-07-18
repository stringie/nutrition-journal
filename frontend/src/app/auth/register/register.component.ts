import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { NgForm } from '@angular/forms';
import { RegisterResponse } from '../types/registerResponse';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/alert/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private service: AccountService, private router: Router, private alert: AlertService) { }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    this.service.register(f.controls.username.value, f.controls.password.value, f.controls.email.value).subscribe((response: RegisterResponse) => {
      if (response.success) {
        this.router.navigate(["../login"])
        this.alert.success("Successfully registered account!")
      } else {
        this.alert.error(response.message)
      }
    })
  }
}
