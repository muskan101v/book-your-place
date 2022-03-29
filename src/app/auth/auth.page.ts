import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  loginForm;
  islogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.minLength(6),
        Validators.required,
      ]),
    });
  }
  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.authenticate(email, password);
    }
  }
  authenticate(email, pass) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (!this.islogin) {
          authObs = this.authService.createUser(email, pass);
        } else {
          authObs = this.authService.login(email, pass);
        }
        authObs.subscribe(
          (res) => {
            loadingEl.dismiss();
            if (!this.islogin) {
              this.router.navigate(['/', 'auth']);
              this.islogin = true;
              let message = 'you have Successfully sign up please login';
              const header = 'Authentication';
              this.showAlert(message, header);
            } else {
              this.router.navigate(['/', 'page', 'tabs', 'discover']);
            }
            this.isLoading = false;
            this.loginForm.reset();
          },
          (error) => {
            const code = error.error.error.message;
            const header = 'Authentication failed';
            let message = 'could not sign you up! please try again.';
            if (code == 'EMAIL_EXISTS') {
              message = 'This email already exists';
            } else if (code == 'EMAIL_NOT_FOUND') {
              message = 'This email not found';
            } else if (code == 'INVALID_PASSWORD') {
              message = 'This password is incorrect!';
            }
            this.isLoading = false;
            loadingEl.dismiss();
            this.showAlert(message, header);
          }
        );
      });
  }

  onSwitchUser() {
    this.islogin = !this.islogin;
  }

  private showAlert(errorMessage, header) {
    this.alertCtrl
      .create({
        header: header,
        message: errorMessage,
        buttons: [
          {
            text: 'okay',
            handler: () => {
              this.router.navigate(['/auth']);
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
