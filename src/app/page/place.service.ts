/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: Date;
  availableTo: Date;
  userId: string;
}
@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private _places = new BehaviorSubject<Place[]>([]);
  constructor(
    private readonly authService: AuthService,
    private http: HttpClient
  ) {}

  get places() {
    // eslint-disable-next-line no-underscore-dangle
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://book-a-place-1fa1b-default-rtdb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
        })
      );
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://book-a-place-1fa1b-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
    let generatedId: string;
    let newplace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user found!');
        }
        newplace = new Place(
          Math.random().toString(),
          title,
          description,
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
          price,
          availableFrom,
          availableTo,
          userId
        );
        return this.http.post<{ name: string }>(
          'https://book-a-place-1fa1b-default-rtdb.firebaseio.com/offered-places.json',
          { ...newplace, id: null }
        );
      }),
      switchMap((resData) => {
        console.log(resData);
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap((places) => {
        newplace.id = generatedId;
        this._places.next(places.concat(newplace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://book-a-place-1fa1b-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}

// [
//   new Place(
//     'p1',
//     'Taj Mahal',
//     'Symbol of Love',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6d3mi2QcgaFCwWRoU3wiDTlvIRYS4TyPhYA&usqp=CAU',
//     160.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'xyz'
//   ),
//   new Place(
//     'p2',
//     'L Amour Toujours',
//     'A romantic place in paris!',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ6T4IZhHJAPu4F2b0ENT0FwHSUCDdnmbwkA&usqp=CAU',
//     149.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p3',
//     'Eiffel Tower',
//     'Lover Point!',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
//     150.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p4',
//     'Eiffel Tower',
//     'Lover Point!',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
//     150.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p5',
//     'Eiffel Tower',
//     'Lover Point!',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
//     150.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p6',
//     'Eiffel Tower',
//     'Lover Point!',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
//     150.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p7',
//     'Eiffel Tower',
//     'Lover Point!',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
//     150.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p8',
//     'Eiffel Tower',
//     'Lover Point!',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
//     150.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p9',
//     'Eiffel Tower',
//     'Lover Point!',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
//     150.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p10',
//     'Eiffel Tower',
//     'Lover Point!',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y9Nkcsjf6o_4EOZD0Hb2klwHnL8y_Lh1Pw&usqp=CAU',
//     150.99,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
// ]
