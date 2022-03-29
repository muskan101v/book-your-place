import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticate) => {
        console.log(isAuthenticate);
        if (!isAuthenticate) {
          return this.authService.autoLogin();
        } else {
          console.log(isAuthenticate);
          return of(isAuthenticate);
        }
      }),
      tap((isAuthenticated) => {
        console.log(isAuthenticated);
        if (!isAuthenticated) {
          this.router.navigate(['/', 'auth']);
        }
        return true;
      })
    );
  }
}
