import {Directive, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActiveEnum} from "@utility/domain/enum";

@Directive({
  selector: '[active-style]',
  standalone: true,
})
export class ActiveStyleDirective implements OnInit, OnChanges {

  @Input()
  public active: ActiveEnum = ActiveEnum.YES;

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  public ngOnChanges(changes: SimpleChanges): void {

    this.initActive();

  }

  public ngOnInit(): void {

    this.initActive();

  }

  public initActive(): void {

    this.elementRef.nativeElement.className = '';

    this.elementRef.nativeElement.classList.add('px-2', 'py-1', 'flex', 'items-center', 'justify-center', 'h-6', 'text-xs', 'rounded-full', 'border', 'text-white', 'uppercase');

    switch (this.active) {

      case ActiveEnum.NO:
        this.elementRef.nativeElement.classList.add('bg-red-500', 'border-red-500', 'dark:bg-red-900', 'dark:text-red-400', 'dark:border-red-800');
        break;

      case ActiveEnum.YES:
        this.elementRef.nativeElement.classList.add('bg-green-500', 'border-green-500', 'dark:bg-green-900', 'dark:text-green-400', 'dark:border-green-800');
        break;

    }

  }

}
