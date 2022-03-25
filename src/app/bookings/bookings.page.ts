import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Boooking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadingBooking: Boooking[];
  constructor(private readonly booking: BookingService) {}

  ngOnInit() {
    this.getBooking();
  }
  getBooking() {
    this.loadingBooking = this.booking.getBooking();
  }
  onCancelBooking(bookingId, slidingItem: IonItemSliding) {
    slidingItem.close();
    console.log(bookingId);
  }
}
