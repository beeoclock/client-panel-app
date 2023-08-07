import {Directive, ElementRef, inject, Input, OnInit} from '@angular/core';
import {StatusEnum} from "@event/domain/enum/status.enum";
import {TranslateService} from "@ngx-translate/core";

@Directive({
  selector: '[event-status-style]',
  standalone: true,
})
export class EventStatusStyleDirective implements OnInit {

  @Input()
  public status: StatusEnum = StatusEnum.requested;

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly translateService = inject(TranslateService);

  public ngOnInit(): void {

    this.elementRef.nativeElement.classList.add('px-2', 'py-1', 'rounded-full', 'border', 'text-xs', 'lowercase');

    switch (this.status) {
      case StatusEnum.cancelled:
        this.elementRef.nativeElement.classList.add('text-red-500', 'bg-red-50', 'border-red-500', 'dark:bg-red-900', 'dark:text-red-400', 'dark:border-red-800');
        break;
      case StatusEnum.done:
        this.elementRef.nativeElement.classList.add('text-green-500', 'bg-green-50', 'border-green-500', 'dark:bg-green-900', 'dark:text-green-400', 'dark:border-green-800');
        break;
      case StatusEnum.requested:
        this.elementRef.nativeElement.classList.add('text-orange-500', 'bg-orange-50', 'border-orange-500', 'dark:bg-orange-900', 'dark:text-orange-400', 'dark:border-orange-800');
        break;
      case StatusEnum.booked:
        this.elementRef.nativeElement.classList.add('text-blue-500', 'bg-blue-50', 'border-blue-500', 'dark:bg-blue-900', 'dark:text-blue-400', 'dark:border-blue-800');
        break;
      default:
        this.elementRef.nativeElement.classList.add('text-neutral-500', 'bg-neutral-50', 'border-neutral-500', 'dark:bg-neutral-900', 'dark:text-neutral-400', 'dark:border-neutral-800');
        break;

    }

    const translateKey = `event.keyword.status.${this.status}`;
    const statusNameInLocal = this.translateService.instant(translateKey);
    this.elementRef.nativeElement.innerText = statusNameInLocal === translateKey ? this.translateService.instant('keyword.capitalize.unknown') : statusNameInLocal;

  }

}
