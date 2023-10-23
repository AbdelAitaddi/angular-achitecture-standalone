import { CityTypesFilter } from './city.model';

export type Statistics = {
  [key in CityTypesFilter]: number;
};
