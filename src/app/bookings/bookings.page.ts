import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadingBooking: Booking[];
  bookSub: Subscription;
  loaadedbook = false;
  isLoading = false;
  constructor(
    private readonly booking: BookingService,
    private loader: LoadingController
  ) {}

  ngOnInit() {
    this.bookSub = this.booking.bookings.subscribe((bookings) => {
      this.loadingBooking = bookings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.booking.fetchbooking().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loader
      .create({ message: 'Cancelation in process !' })
      .then((loadingEl) => {
        loadingEl.present();
        this.booking.cancelBooking(bookingId).subscribe((res) => {
          console.log(res);
          loadingEl.dismiss();
        });
      });
  }

  ngOnDestroy(): void {
    if (this.bookSub) {
      this.bookSub.unsubscribe();
    }
  }
}
