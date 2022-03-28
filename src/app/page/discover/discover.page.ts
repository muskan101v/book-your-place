import { Component, OnDestroy, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
// import { MenuController } from '@ionic/angular/providers/menu-controller';
import { Place } from '../place.model';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  isLoading = false;
  relvantPlaces: Place[];
  placesSub: Subscription;
  constructor(
    private readonly placeService: PlaceService,
    private authService: AuthService // private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.relvantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relvantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placeService.fetchPlaces().subscribe((places) => {
      this.isLoading = false;
    });
  }
  // onOpenMenu() {
  //   this.menuCtrl.toggle();
  // }
  onFilterUpdate(event) {
    if (event.detail.value === 'all') {
      this.relvantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relvantPlaces.slice(1);
    } else {
      this.relvantPlaces = this.loadedPlaces.filter(
        (place) => place.userId !== this.authService.userId
      );

      this.listedLoadedPlaces = this.relvantPlaces.slice(1);
    }
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
