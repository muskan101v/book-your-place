import { Component, OnDestroy, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  isLoading = false;
  offerLength;
  private placesSub: Subscription;

  constructor(
    private placesService: PlaceService,
    private readonly router: Router
  ) {}
  ngOnInit(): void {
    // this.placesSub = this.placesService.places.subscribe((res) => {
    //   this.offers = res;
    // });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe((res) => {
      this.isLoading = false;
      this.offers = res;
      this.offerLength = this.offers.length;
    });
  }
  onEdit(offerId, slidinItem: IonItemSliding) {
    slidinItem.close();
    this.router.navigate(['/', 'page', 'tabs', 'offers', 'edit', offerId]);
    console.log(`offerId ${offerId}`);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
