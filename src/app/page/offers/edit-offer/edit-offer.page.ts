import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlaceService } from '../../place.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place: Place;
  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly placeService: PlaceService
  ) {}

  ngOnInit() {
    this.activateRoute.paramMap.subscribe((params) => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack(`/page/tabs/offer/params.get('placeId')`);
        return;
      } else {
        this.place=this.placeService.getPlace(params.get('placeId'));
      }
    });
  }
}
