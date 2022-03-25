import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedPlace: Place[];
  constructor(private readonly placeService: PlaceService) { }

  ngOnInit() {
    this.loadedPlace= this.placeService.getPlaces();
    console.log(this.loadedPlace);
  }

  ionViewWillEnter(){

  }
}
