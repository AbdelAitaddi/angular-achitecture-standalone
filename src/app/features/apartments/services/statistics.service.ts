import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// services
import { DataService } from '../../../core/services';

// config
import { APP_CONFIG } from '../../../app.config';

// models
import { Statistics } from '../models';
import { AppConfig } from '../../../core/models';

// rxjs
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService extends DataService {
  readonly ApiUrl = this.appConfig.statistics;

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {
    super();
  }

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(this.ApiUrl).pipe(catchError(this.handleError));
  }
}
