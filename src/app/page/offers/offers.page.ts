import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: Place[];

  constructor(
    private placesService: PlaceService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.offers = this.placesService.getPlaces();
  }
  onEdit(offerId, slidinItem: IonItemSliding) {
    slidinItem.close();
    this.router.navigate(['/', 'page', 'tabs', 'offers', 'edit', offerId]);
    console.log(`offerId ${offerId}`);
  }
}
