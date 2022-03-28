/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceService } from '../../place.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  newOfferForm;
  constructor(
    private readonly placeService: PlaceService,
    private readonly router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.newOfferForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      shortDescription: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }
  onCreateOffer() {
    if (!this.newOfferForm.valid) {
      return;
    } else {
      this.loadingCtrl
        .create({
          message: 'Creating place...',
        })
        .then((loadingEl) => {
          loadingEl.present();
          this.placeService
            .addPlace(
              this.newOfferForm.value.title,
              this.newOfferForm.value.shortDescription,
              this.newOfferForm.value.price,
              this.newOfferForm.value.dateFrom,
              this.newOfferForm.value.dateTo
            )
            .subscribe(() => {
              loadingEl.dismiss();
              this.newOfferForm.reset();
              this.router.navigate(['/', 'page', 'tabs', 'offers']);
            });
        });
    }
  }
}
