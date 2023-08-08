import {Directive, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {StatusEnum} from "@event/domain/enum/status.enum";
import {TranslateService} from "@ngx-translate/core";

@Directive({
  selector: '[event-status-style]',
  standalone: true,
})
export class EventStatusStyleDirective implements OnInit, OnChanges {

  @Input()
  public status: StatusEnum = StatusEnum.requested;

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly translateService = inject(TranslateService);

  public ngOnChanges(changes: SimpleChanges & {status: SimpleChanges}) {
    console.log(changes);

    if (changes.status) {

      this.initStatus();

    }

  }

  public ngOnInit(): void {

    this.initStatus();

  }

  public initStatus(): void {

    this.elementRef.nativeElement.className = '';

    this.elementRef.nativeElement.classList.add('px-2', 'py-1', 'flex', 'items-center', 'justify-center', 'h-6', 'text-xs', 'rounded-full', 'border', 'text-white', 'uppercase');

    switch (this.status) {
      case StatusEnum.cancelled:
        this.elementRef.nativeElement.classList.add('bg-red-500', 'border-red-500', 'dark:bg-red-900', 'dark:text-red-400', 'dark:border-red-800');
        break;
      case StatusEnum.done:
        this.elementRef.nativeElement.classList.add('bg-green-500', 'border-green-500', 'dark:bg-green-900', 'dark:text-green-400', 'dark:border-green-800');
        break;
      case StatusEnum.requested:
        this.elementRef.nativeElement.classList.add('bg-orange-500', 'border-orange-500', 'dark:bg-orange-900', 'dark:text-orange-400', 'dark:border-orange-800');
        break;
      case StatusEnum.booked:
        this.elementRef.nativeElement.classList.add('bg-blue-500', 'border-blue-500', 'dark:bg-blue-900', 'dark:text-blue-400', 'dark:border-blue-800');
        break;
      default:
        this.elementRef.nativeElement.classList.add('bg-neutral-500', 'border-neutral-500', 'dark:bg-neutral-900', 'dark:text-neutral-400', 'dark:border-neutral-800');
        break;

    }

    const translateKey = `event.keyword.status.${this.status}`;
    const statusNameInLocal = this.translateService.instant(translateKey);
    this.elementRef.nativeElement.innerText = statusNameInLocal === translateKey ? this.translateService.instant('keyword.capitalize.unknown') : statusNameInLocal;


  }

}
