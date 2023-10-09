import { All_Cities, Apartment, CityTypesFilter } from '../models';

export interface ApartmentsState {
  apartments: Apartment[];
  selectedApartment: Apartment | null;
  favourites: string[];
  selectedBorough: string | typeof All_Cities;
  selectedCity: CityTypesFilter;
  loaded: boolean;
  loading: boolean;
}
