import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
// import { MenuController } from '@ionic/angular/providers/menu-controller';
import { Place } from '../place.model';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlace: Place[];
  listedLoadedPlaces: Place[];
  constructor(
    private readonly placeService: PlaceService // private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.loadedPlace = this.placeService.getPlaces();
    this.listedLoadedPlaces = this.loadedPlace.slice(1);
  }

  ionViewWillEnter() {}
  // onOpenMenu() {
  //   this.menuCtrl.toggle();
  // }
  onFilterChange(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }
}
