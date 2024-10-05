import {Directive, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";

@Directive({
	selector: '[orderServiceStatusStyle]',
	standalone: true,
})
export class OrderServiceStatusStyleDirective implements OnInit, OnChanges {

	@Input({required: true})
	public status!: OrderServiceStatusEnum;

	@Input()
	public mode: 'text' | 'badge' = 'badge';

	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly translateService = inject(TranslateService);

	private readonly classListByStatusAndMode: Record<OrderServiceStatusEnum, Record<'text' | 'badge' | 'base', string[]>> = {
		[OrderServiceStatusEnum.cancelled]: {
			base: ['dark:text-red-400'],
			text: ['text-red-400', 'border-red-400'],
			badge: ['bg-red-500', 'border-red-500', 'dark:bg-red-900', 'dark:border-red-800']
		},
		[OrderServiceStatusEnum.rejected]: {
			base: ['dark:text-red-400'],
			text: ['text-red-400', 'border-red-400'],
			badge: ['bg-red-500', 'border-red-500', 'dark:bg-red-900', 'dark:border-red-800']
		},
		[OrderServiceStatusEnum.done]: {
			base: ['dark:text-green-400'],
			text: ['text-green-600', 'border-green-600'],
			badge: ['bg-green-600', 'border-green-600', 'dark:bg-green-900', 'dark:border-green-800']
		},
		[OrderServiceStatusEnum.requested]: {
			base: ['dark:text-orange-400'],
			text: ['text-orange-400', 'border-orange-400'],
			badge: ['bg-orange-500', 'border-orange-500', 'dark:bg-orange-900', 'dark:border-orange-800']
		},
		[OrderServiceStatusEnum.accepted]: {
			base: ['dark:text-blue-400'],
			text: ['text-blue-400', 'border-blue-400'],
			badge: ['bg-blue-500', 'border-blue-500', 'dark:bg-blue-900', 'dark:border-blue-800']
		},
		[OrderServiceStatusEnum.inProgress]: {
			base: ['dark:text-yellow-400'],
			text: ['text-yellow-400', 'border-yellow-400'],
			badge: ['bg-yellow-500', 'border-yellow-500', 'dark:bg-yellow-900', 'dark:border-yellow-800']
		},
		[OrderServiceStatusEnum.deleted]: {
			base: ['dark:text-grey-400'],
			text: ['text-grey-400', 'border-grey-400'],
			badge: ['bg-grey-500', 'border-grey-500', 'dark:bg-grey-900', 'dark:border-grey-800']
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
