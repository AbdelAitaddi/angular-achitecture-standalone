import { Pipe, PipeTransform } from '@angular/core';

// models
import { All_Cities, Apartment } from '../../features/apartments/models';

@Pipe({
  name: 'byBoroughs',
  standalone: true,
})
export class BoroughsPipe implements PipeTransform {
  transform(apartments: Apartment[], borough: string | typeof All_Cities) {
    return borough !== All_Cities
      ? apartments.filter((apartment) => borough === apartment?.address?.borough)
      : apartments;
  }
}
