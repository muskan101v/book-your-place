import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Place } from '../../place.model';
import { PlaceService } from '../../place.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place;
  editForm;
  isLoading = false;
  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly placeService: PlaceService,
    private loadingCtrl: LoadingController,
    private readonly router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.activateRoute.paramMap.subscribe((params) => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack(`/page/tabs/offer/params.get('placeId')`);
        return;
      } else {
        this.placeService.getPlace(params.get('placeId')).subscribe(
          (res) => {
            this.place = res;
            this.createForm();
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.alertCtrl
              .create({
                header: 'An error occurred !',
                message: 'Place could not be fetch please try again',
                buttons: [
                  {
                    text: 'okay',
                    handler: () => {
                      this.router.navigate(['/page/tabs/offers']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
      }
    });
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
      this.loadingCtrl
        .create({
          message: 'Updating place...',
        })
        .then((loadingEl) => {
          loadingEl.present();
          this.placeService
            .updatePlace(
              this.place.id,
              this.editForm.value.title,
              this.editForm.value.shortDescription
            )
            .subscribe((res) => {
              loadingEl.dismiss();
              this.editForm.reset();
              this.router.navigate(['/', 'page', 'tabs', 'offers']);
            });
        });
    }
  }
}
