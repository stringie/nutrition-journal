import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private jwtHelper: JwtHelperService

  constructor(private request: RequestService, private router: Router) {
    this.jwtHelper = new JwtHelperService()
  }

  public login(username: string, password: string) {
    return this.request.post(`/login`, { username, password })
  }

  public register(username: string, password: string) {
    return this.request.post(`/register`, { username, password })
  }

  public logout() {
    localStorage.removeItem('token')
    this.router.navigate(["/login"])
  }

  public isAuthenticated() {
    const token = localStorage.getItem('token');

    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false
  }
}
