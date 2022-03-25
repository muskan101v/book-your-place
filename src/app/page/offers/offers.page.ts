import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  offers: Place[];

  constructor(private placesService: PlaceService) { }

  ngOnInit() {
    this.offers = this.placesService.getPlaces();
  }
}
