import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Taj Mahal',
      'Symbol of Love',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6d3mi2QcgaFCwWRoU3wiDTlvIRYS4TyPhYA&usqp=CAU',
      160.99
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in paris!',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ6T4IZhHJAPu4F2b0ENT0FwHSUCDdnmbwkA&usqp=CAU',
      149.99
    ),
    new Place(
      'p3',
      'Eiffel Tower',
      'Lover Point!',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
      150.99
    ),
  ];
  constructor() {}

  getPlaces() {
    // eslint-disable-next-line no-underscore-dangle
    return [...this._places];
  }

  getPlace(id: string) {
    // eslint-disable-next-line no-underscore-dangle
    return { ...this._places.find((res) => res.id === id) };
  }
}
