import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlaceService } from '../../place.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place;
  placeSub: Subscription;
  isLoading = false;
  isbookable = false;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlaceService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loaderCtrl: LoadingController,
    private booking: BookingService,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      let fetchedUserId: string;
      this.authService.userId
        .pipe(
          take(1),
          switchMap((userId) => {
            if (!userId) {
              throw new Error('Found no user!');
            }
            fetchedUserId = userId;
            return this.placesService.getPlace(paramMap.get('placeId'));
          })
        )
        .subscribe(
          (res) => {
            this.place = res;
            this.isbookable = this.place.userId !== fetchedUserId;
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.alertCtrl
              .create({
                header: 'An error occurred !',
                message: 'could nnot load place please try again',
                buttons: [
                  {
                    text: 'okay',
                    handler: () => {
                      this.router.navigate(['/page/tabs/discover']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
    });
  }
  onBookPlace() {
    // this.router.navigate(['/page/tabs/discover']);
    // this.navCtrl.navigateBack('/page/tabs/discover');
    //  this.navCtrl.pop();
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }
  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData);

        if (resultData.role === 'confirm') {
          this.loaderCtrl
            .create({ message: 'Booking place...' })
            .then((loadinEl) => {
              loadinEl.present();
              const bookData = resultData.data?.bookingData;
              // eslint-disable-next-line max-len
              this.booking
                .addBooking(
                  this.place?.id,
                  this.place.title,
                  this.place?.imageUrl,
                  bookData.firstName,
                  bookData.lastName,
                  bookData.guestNumber,
                  bookData.startDate,
                  bookData.endDate
                )
                .subscribe((res) => {
                  loadinEl.dismiss();
                  this.router.navigate(['/', 'page', 'tabs', 'discover']);
                });
            });
        }
      });
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
