import { Injectable } from '@angular/core';
import { Boooking } from './booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private booking: Boooking[] = [
    {
      id: 'xyz',
      userId: 'abc',
      placeId: 'p1',
      placeTitle: 'Taj Mahal',
      guestNumber: 2,
    },
  ];
  constructor() {}

  getBooking() {
    return [...this.booking];
  }
}
