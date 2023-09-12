import {Directive, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";

@Directive({
	selector: '[event-status-style]',
	standalone: true,
})
export class EventStatusStyleDirective implements OnInit, OnChanges {

	@Input()
	public status = EventStatusEnum.requested;

	@Input()
	public mode: 'text' | 'badge' = 'badge';

	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly translateService = inject(TranslateService);

	private readonly classListByStatusAndMode: Record<EventStatusEnum, Record<'text' | 'badge' | 'base', string[]>> = {
		[EventStatusEnum.cancelled]: {
			base: ['dark:text-red-400'],
			text: ['text-red-400', 'border-red-400'],
			badge: ['bg-red-500', 'border-red-500', 'dark:bg-red-900', 'dark:border-red-800']
		},
		[EventStatusEnum.done]: {
			base: ['dark:text-green-400'],
			text: ['text-green-400', 'border-green-400'],
			badge: ['bg-green-500', 'border-green-500', 'dark:bg-green-900', 'dark:border-green-800']
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
		}
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

		switch (this.mode) {
			case "badge":
				this.elementRef.nativeElement.classList.add('text-white');
				break;
		}

		this.elementRef.nativeElement.classList.add(
			...this.classListByStatusAndMode[this.status].base,
			...this.classListByStatusAndMode[this.status][this.mode]
		);

		const translateKey = `event.keyword.status.singular.${this.status}`;
		const statusNameInLocal = this.translateService.instant(translateKey);
		this.elementRef.nativeElement.innerText = statusNameInLocal === translateKey ? this.translateService.instant('keyword.capitalize.unknown') : statusNameInLocal;


	}

}
