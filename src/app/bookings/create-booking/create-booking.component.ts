import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonDatetime, ModalController } from '@ionic/angular';
import { Place } from 'src/app/page/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @ViewChild('startDateCtrl') startDateCtrl: IonDatetime;
  @Input() selectedPlace: Place;
  createBookingForm;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() selectedMode: 'select' | 'random';
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.createForm();
    if (this.selectedMode === 'random') {
      this.setForm();
    }
  }
  createForm() {
    this.createBookingForm = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      guest: new FormControl('1'),
      fromDate: new FormControl('2022-03-25'),
      toDate: new FormControl(),
    });
  }
  setForm() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    this.createBookingForm.patchValue({
      fromDate: new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString(),
      toDate: new Date(
        new Date(this.createBookingForm.value.fromDate).getTime() +
          Math.random() *
            (new Date(this.createBookingForm.value.fromDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.createBookingForm.value.fromDate).getTime())
      ).toISOString(),
    });
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  onBookPlace() {
    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.createBookingForm.value.firstName,
          lastName: this.createBookingForm.value.lastName,
          guestNumber: this.createBookingForm.value.guest,
          startDate: this.createBookingForm.value.fromDate,
          endDate: this.createBookingForm.value.toDate,
        },
      },
      'confirm'
    );
    // console.log(this.createBookingForm);
  }
  datesValid() {
    const startDate = new Date(this.createBookingForm.value.fromDate);
    const endDate = new Date(this.createBookingForm.value.toDate);
    return endDate > startDate;
  }
}
