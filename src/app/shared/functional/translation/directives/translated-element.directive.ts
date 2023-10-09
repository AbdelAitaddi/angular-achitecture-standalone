import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTranslatedElement]',
})
export class TranslatedElementDirective {
  @Input('appTranslatedElement')
  public elementKey: string;

  constructor(public readonly viewRef: ViewContainerRef, public readonly templateRef: TemplateRef<HTMLElement>) {}
}
