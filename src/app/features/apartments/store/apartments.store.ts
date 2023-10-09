import { Injectable } from '@angular/core';

// services
import { Store } from '../../../shared/core/store';

// models
import { ApartmentsState } from './apartments.state';

// config
import { All_Cities } from '../config';

// Initial state
const initialState: ApartmentsState = {
  apartments: [],
  favourites: [],
  selectedApartment: null,
  selectedBorough: All_Cities,
  selectedCity: All_Cities,
  loaded: false,
  loading: false,
  pageNumber: 0,
  allDataLoaded: false,
};

@Injectable({
  providedIn: 'root',
})
export class ApartmentsStore extends Store<ApartmentsState> {
  constructor() {
    super(initialState);
  }
}
