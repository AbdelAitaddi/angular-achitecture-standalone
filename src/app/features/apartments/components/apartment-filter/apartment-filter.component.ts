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
import { All_Cities, CityTypes, CityTypesFilter } from '../../models';

// rxjs
import { distinctUntilChanged } from 'rxjs/operators';

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
  ],
  templateUrl: './apartment-filter.component.html',
  styleUrls: ['./apartment-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentFilterComponent implements OnInit {
  @Input({ required: true }) set selectedCity(city: CityTypesFilter) {
    this.cityControl.setValue(city, { emitEvent: false });
  }
  @Input({ required: true }) set selectedBorough(borough: string | typeof All_Cities) {
    this.boroughControl.setValue(borough, { emitEvent: false });
  }
  @Input({ required: true }) boroughs: string[] = [];
  @Input({ required: true }) cities: CityTypes[] = [];
  @Output() boroughSelected = new EventEmitter<string | typeof All_Cities>();
  @Output() citySelected = new EventEmitter<CityTypesFilter>();

  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  form = this.fb.group({
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
