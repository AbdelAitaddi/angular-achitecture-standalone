import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { MaterialCoreModule } from '../functional/material-core/material-core.module';

// components
import * as fromComponents from './components';

// pipes
import * as fromPipes from './pipes';

@NgModule({
  imports: [CommonModule, RouterModule, MaterialCoreModule],
  declarations: [...fromPipes.pipes, ...fromComponents.components],
  exports: [...fromPipes.pipes, ...fromComponents.components],
})
export class SharedCoreModule {
  static forRoot(): ModuleWithProviders<SharedCoreModule> {
    return {
      ngModule: SharedCoreModule,
      providers: [],
    };
  }
}
