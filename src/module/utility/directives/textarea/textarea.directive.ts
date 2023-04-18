import {Directive, HostBinding} from '@angular/core';

@Directive({
  selector: 'textarea[beeoclock]',
  standalone: true,
})
export class TextareaDirective {
  @HostBinding()
  public class = ['form-control'];
}
