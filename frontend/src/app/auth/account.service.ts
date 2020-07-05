import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private request: RequestService, private router: Router) { }

  public login(username: string, password: string) {
    return this.request.post(`/login`, { username: username, password: password })
  }

  public register(username: string, password: string) {
    return this.request.post(`/register`, {username: username, password: password })
  }

  public logout() {
    localStorage.removeItem('token')
    this.router.navigate(["/login"])
  }
}
