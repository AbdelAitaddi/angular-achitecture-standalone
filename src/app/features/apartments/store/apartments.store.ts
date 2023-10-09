import { Injectable } from '@angular/core';

// models
import { All_Cities } from '../models';
import { ApartmentsState } from './apartments.state';

// services
import { Store } from '../../../shared/store';

// Initial state
const initialState: ApartmentsState = {
  apartments: [],
  favourites: [],
  selectedApartment: null,
  selectedBorough: All_Cities,
  selectedCity: All_Cities,
  loaded: false,
  loading: false,
};

@Injectable({
  providedIn: 'root',
})
export class ApartmentsStore extends Store<ApartmentsState> {
  constructor() {
    super(initialState);
  }
}
