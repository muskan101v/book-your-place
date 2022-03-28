/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userId = 'abc';
  private _userIsAuthenticated = true;

  constructor() {}
  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userID() {
    return this.userId;
  }
  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
