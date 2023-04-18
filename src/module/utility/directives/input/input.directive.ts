import {Directive, ElementRef, HostBinding, inject} from '@angular/core';

@Directive({
  selector: 'input[beeoclock]',
  standalone: true,
})
export class InputDirective {
  @HostBinding()
  public class = ['form-control'];

  @HostBinding()
  public type: 'text' | 'email' | 'password' | 'datetime-local' = 'text';

  public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
}
