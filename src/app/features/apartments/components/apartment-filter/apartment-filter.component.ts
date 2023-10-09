import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// models
import { CityTypes, CityTypesFilter } from '../../models';

// rxjs
import { distinctUntilChanged } from 'rxjs/operators';
import { All_Cities } from '../../config';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-apartment-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './apartment-filter.component.html',
  styleUrls: ['./apartment-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentFilterComponent implements OnInit {
  @Input() set selectedCity(city: CityTypesFilter) {
    this.cityControl.setValue(city, { emitEvent: false });
  }
  @Input() set selectedBorough(borough: string | typeof All_Cities) {
    this.boroughControl.setValue(borough, { emitEvent: false });
  }
  @Input() boroughs: string[] = [];
  @Input() cities: CityTypes[] = [];
  @Output() boroughSelected = new EventEmitter<string | typeof All_Cities>();
  @Output() citySelected = new EventEmitter<CityTypesFilter>();
  private destroyRef = inject(DestroyRef);
  private fb = new FormBuilder();

  form = this.fb.group<{
    city: CityTypesFilter;
    borough: string | typeof All_Cities;
  }>({
    city: All_Cities,
    borough: All_Cities,
  });

  ngOnInit() {
    this.cityControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((selectedCity) => this.citySelected.emit(selectedCity));

    this.boroughControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((value) => this.boroughSelected.emit(value));
  }

  get cityControl() {
    return this.form.get('city') as FormControl;
  }

  get boroughControl() {
    return this.form.get('borough') as FormControl;
  }
}
