import {Directive, ElementRef, inject, input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {EventStatusEnum} from "@core/shared/enum/event-status.enum";

@Directive({
	selector: '[eventStatusStyle]',
	standalone: true,
})
export class EventStatusStyleDirective implements OnInit, OnChanges {

	public readonly status = input(EventStatusEnum.requested);

	public readonly mode = input<'text' | 'badge'>('badge');

	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly translateService = inject(TranslateService);

	private readonly classListByStatusAndMode: Record<EventStatusEnum, Record<'text' | 'badge' | 'base', string[]>> = {
		[EventStatusEnum.cancelled]: {
			base: ['dark:text-red-400'],
			text: ['text-red-400', 'border-red-400'],
			badge: ['bg-red-500', 'border-red-500', 'dark:bg-red-900', 'dark:border-red-800']
		},
		[EventStatusEnum.rejected]: {
			base: ['dark:text-red-400'],
			text: ['text-red-400', 'border-red-400'],
			badge: ['bg-red-500', 'border-red-500', 'dark:bg-red-900', 'dark:border-red-800']
		},
		[EventStatusEnum.done]: {
			base: ['dark:text-green-400'],
			text: ['text-green-600', 'border-green-600'],
			badge: ['bg-green-600', 'border-green-600', 'dark:bg-green-900', 'dark:border-green-800']
		},
		[EventStatusEnum.requested]: {
			base: ['dark:text-orange-400'],
			text: ['text-orange-400', 'border-orange-400'],
			badge: ['bg-orange-500', 'border-orange-500', 'dark:bg-orange-900', 'dark:border-orange-800']
		},
		[EventStatusEnum.booked]: {
			base: ['dark:text-blue-400'],
			text: ['text-blue-400', 'border-blue-400'],
			badge: ['bg-blue-500', 'border-blue-500', 'dark:bg-blue-900', 'dark:border-blue-800']
		},
	};

	private readonly base = ['px-2', 'py-1', 'flex', 'items-center', 'justify-center', 'h-6', 'text-xs', 'rounded-full', 'border', 'uppercase'];

	public ngOnChanges(changes: SimpleChanges & { status: SimpleChanges }) {
		if (changes.status) {
			this.initStatus();
		}
	}

	public ngOnInit(): void {

		this.initStatus();

	}

	public initStatus(): void {

		this.elementRef.nativeElement.className = '';

		this.elementRef.nativeElement.classList.add(...this.base);

		const mode = this.mode();
  switch (mode) {
			case "badge":
				this.elementRef.nativeElement.classList.add('text-white');
				break;
		}

		const status = this.status();
  this.elementRef.nativeElement.classList.add(
			...this.classListByStatusAndMode[status].base,
			...this.classListByStatusAndMode[status][mode]
		);

		const translateKey = `event.keyword.status.singular.${status}`;
		const statusNameInLocal = this.translateService.instant(translateKey);
		this.elementRef.nativeElement.innerText = statusNameInLocal === translateKey ? this.translateService.instant('keyword.capitalize.unknown') : statusNameInLocal;


	}

}
