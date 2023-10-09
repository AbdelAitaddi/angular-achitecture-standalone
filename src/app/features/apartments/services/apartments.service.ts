import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { DataService } from '../../../core/services';

// models
import { Apartment, CityTypesFilter } from '../models';
import { AppConfig } from '../../../core/models';

// rxjs
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// config
import { APP_CONFIG } from '../../../app.config';
import { All_Cities } from '../config';

@Injectable({
  providedIn: 'root',
})
export class ApartmentsService extends DataService {
  readonly ApiUrl = this.appConfig.apartmentsApiRoot;

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {
    super();
  }

  getApartments(city: CityTypesFilter = All_Cities, page: number = 1): Observable<Apartment[]> {
    const cityParam = city !== All_Cities ? `address.city=${city}&` : '';
    return this.http
      .get<Apartment[]>(`${this.ApiUrl}?${cityParam}_page=${page}&_limit=10`)
      .pipe(catchError(this.handleError));
  }

  getApartment(id: string): Observable<Apartment> {
    return this.http.get<Apartment>(`${this.ApiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
