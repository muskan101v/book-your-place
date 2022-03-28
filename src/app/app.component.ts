import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router
  ) {
    // this.initializeApp();
  }
  ngOnInit(): void {}
  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     this.statusBar.styleDefault();
  //     this.splashScreen.hide();
  //   });
  // }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
