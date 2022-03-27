import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  editForm;
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
        this.place = this.placeService.getPlace(params.get('placeId'));
      }
    });
    this.createForm();
  }

  createForm() {
    this.editForm = new FormGroup({
      title: new FormControl(this.place.title, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      shortDescription: new FormControl(this.place.description, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }
  onUpdateOffer() {
    if (!this.editForm.valid) {
      return;
    } else {
      console.log(this.editForm);
    }
  }
}
