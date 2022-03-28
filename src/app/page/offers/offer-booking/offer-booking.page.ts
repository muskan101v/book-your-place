import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlaceService } from '../../place.service';

@Component({
  selector: 'app-offer-booking',
  templateUrl: './offer-booking.page.html',
  styleUrls: ['./offer-booking.page.scss'],
})
export class OfferBookingPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;
  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly placeService: PlaceService
  ) {}

  ngOnInit() {
    // this.activateRoute.paramMap.subscribe((params) => {
    //   if (!params.has('placeId')) {
    //     this.navCtrl.navigateBack('/page/tabs/offer');
    //     return;
    //   } else {
    //     this.placeSub = this.placeService
    //       .getPlace(params.get('placeId'))
    //       .subscribe((res) => {
    //         this.place = res;
    //       });
    //   }
    // });
  }

  onEdit() {}
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
