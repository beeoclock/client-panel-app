import {AfterViewInit, Component, ElementRef, HostBinding, inject, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'input[beeoclock]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `
})
export class InputComponent implements AfterViewInit {
  @HostBinding()
  public class = ['form-control'];

  @HostBinding()
  public type = 'text';

  public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  public ngAfterViewInit(): void {
    console.log(this.elementRef.nativeElement.id);
  }
}
