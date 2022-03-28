/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);
  constructor(private authService: AuthService, private http: HttpClient) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  fetchbooking() {
    return this.http
      .get(
        `https://book-a-place-1fa1b-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userID}"`
      )
      .pipe(
        map((resData) => {
          const bookings = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              bookings.push(
                new Booking(
                  key,
                  resData[key].placeId,
                  resData[key].userId,
                  resData[key].placeTitle,
                  resData[key].placeImage,
                  resData[key].firstName,
                  resData[key].lastName,
                  resData[key].guestNumber,
                  new Date(resData[key].bookedFrom),
                  new Date(resData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
          // return [];
        }),
        tap((places) => {
          this._bookings.next(places);
        })
      );
  }
  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    let generatedId: string;
    return this.http
      .post<{ name: string }>(
        'https://book-a-place-1fa1b-default-rtdb.firebaseio.com/bookings.json',
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap((res) => {
          newBooking.id = generatedId;
          this._bookings.next(res.concat(newBooking));
        })
      );
  }
  cancelBooking(id: string) {
    return this.http
      .delete(
        `https://book-a-place-1fa1b-default-rtdb.firebaseio.com/bookings/${id}.json`
      )
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap((resData) => {
          this._bookings.next(resData.filter((pl) => pl.id !== id));
        })
      );
  }
}
