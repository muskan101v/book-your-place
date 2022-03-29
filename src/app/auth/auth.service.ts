/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Plugin, Plugins } from '@capacitor/core';
import { Storage } from '@capacitor/storage';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  apiKey = environment.apiKey;
  private _user = new BehaviorSubject<User>(null);
  private activeLogouttimer: any;

  constructor(private http: HttpClient) {}
  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        console.log(user);
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  login(email, password) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(tap((resData) => this.setuserData(resData)));
  }

  logout() {
    if (this.activeLogouttimer) {
      clearTimeout(this.activeLogouttimer);
    }
    this._user.next(null);
    Storage.remove({ key: 'authData' });
  }

  ngOnDestroy(): void {
    if (this.activeLogouttimer) {
      clearTimeout(this.activeLogouttimer);
    }
  }

  createUser(email: string, pass: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        {
          email,
          password: pass,
          returnSecureToken: true,
        }
      )
      .pipe(tap((resData) => this.setuserData(resData)));
  }

  private setuserData(resData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +resData.expiresIn * 10000
    );
    const user = new User(
      resData.localId,
      resData.email,
      resData.idToken,
      expirationTime
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      resData.localId,
      resData.idToken,
      expirationTime.toISOString(),
      resData.email
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    expirationTime: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId,
      token,
      expirationTime,
      email,
    });
    Storage.set({ key: 'authData', value: data });
  }

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
      map((storedeData) => {
        if (!storedeData || !storedeData.value) {
          return null;
        }
        const parseData = JSON.parse(storedeData.value) as {
          token: string;
          expirationTime: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parseData.expirationTime);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parseData.email,
          parseData.userId,
          parseData.token,
          expirationTime
        );

        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  private autoLogout(duration: number) {
    if (this.activeLogouttimer) {
      clearTimeout(this.activeLogouttimer);
    }
    this.activeLogouttimer = setTimeout(() => {
      this.logout();
    }, duration);
  }
}
