import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// models
import { Apartment } from '../models';

// rxjs
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApartmentsService {
  readonly ApiUrl = '/api/apartments';

  constructor(private http: HttpClient) {}

  getApartments(): Observable<Apartment[]> {
   return this.http
     .get<Apartment[]>(this.ApiUrl)
     .pipe(catchError((error) => throwError(() => error)));
  }

  getApartment(id: string): Observable<Apartment> {
    return this.http
      .get<Apartment>(`${this.ApiUrl}/${id}`)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
