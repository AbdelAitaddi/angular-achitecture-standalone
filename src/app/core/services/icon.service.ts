import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

// rxjs
import { from, Observable } from 'rxjs';
import { tap, toArray } from 'rxjs/operators';

export const Icon_list = {
  back: 'arrow_back',
  realEstate: 'real_estate_agent',
  favorite: 'favorite',
  heartPlus: 'heart_plus',
  heartMinus: 'heart_minus',
  heartCheck: 'heart_check',
  volunteerActivism: 'volunteer_activism',
  locationCity: 'location_city',
  info: 'info',
} as const;

export type IconTypes = (typeof Icon_list)[keyof typeof Icon_list];

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  registerIcons(): Observable<IconTypes[]> {
    return from(Object.values(Icon_list)).pipe(
      tap({
        next: (icon) => {
          const iconUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/${icon}.svg`);
          this.iconRegistry.addSvgIcon(icon, iconUrl);
        },
      }),
      toArray()
    );
  }
}
