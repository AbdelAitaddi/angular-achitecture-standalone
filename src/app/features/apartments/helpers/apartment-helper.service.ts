import { Injectable } from '@angular/core';
import { uniq } from 'lodash';

// models
import { All_Cities, Apartment, CityTypes, CityTypesFilter } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApartmentHelperService {
  getMappedBoroughs(apartments: Apartment[], selectedCity: CityTypesFilter): string[] {
    const apartmentsBvCity =
      selectedCity !== All_Cities
        ? apartments.filter(
            (apartment: Apartment) => apartment.address.city.toLocaleLowerCase() === selectedCity.toLocaleLowerCase()
          )
        : apartments;
    return uniq(apartmentsBvCity.map(({ address: { borough } }: Apartment) => borough));
  }

  filterByCityName(apartments: Apartment[], selectedCity: CityTypes): Apartment[] {
    return apartments.filter(
      ({ address: { city } }: Apartment) => city.toLocaleLowerCase().search(selectedCity.toLocaleLowerCase()) > -1
    );
  }
}
