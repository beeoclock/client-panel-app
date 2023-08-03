import {Directive, ElementRef, inject, Input, OnInit} from '@angular/core';
import {ActiveEnum} from "@utility/domain/enum";

@Directive({
  selector: '[active-style]',
  standalone: true,
})
export class ActiveStyleDirective implements OnInit {

  @Input()
  public active: ActiveEnum = ActiveEnum.YES;

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  public ngOnInit(): void {

    this.elementRef.nativeElement.classList.add('px-2', 'py-1', 'rounded-full', 'border', 'text-xs', 'lowercase');

    switch (this.active) {
      case ActiveEnum.NO:
        this.elementRef.nativeElement.classList.add('text-red-500', 'bg-red-50', 'border-red-500', 'dark:bg-red-900', 'dark:text-red-400', 'dark:border-red-800');
        break;
      case ActiveEnum.YES:
        this.elementRef.nativeElement.classList.add('text-green-500', 'bg-green-50', 'border-green-500', 'dark:bg-green-900', 'dark:text-green-400', 'dark:border-green-800');
        break;

    }

  }

}
