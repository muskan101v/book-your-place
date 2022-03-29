import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router
  ) {
    // this.initializeApp();
  }
  ngOnInit(): void {
    this.authSub = this.authService.userIsAuthenticated.subscribe((isauth) => {
      if (!isauth && this.previousAuthState !== isauth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isauth;
    });
  }
  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     this.statusBar.styleDefault();
  //     this.splashScreen.hide();
  //   });
  // }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
