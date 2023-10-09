import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// models
import { LanguageSelection } from '../../../shared/functional/translation/models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, TranslateModule],
  selector: 'app-language-selection',
  templateUrl: './language-selection.component.html',
  styleUrls: ['./language-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectionComponent {
  @Input({ required: true }) currentLanguage: LanguageSelection;
  @Input({ required: true }) languages: LanguageSelection[] = [];
  @Output() selectLanguage = new EventEmitter<LanguageSelection>();
}
