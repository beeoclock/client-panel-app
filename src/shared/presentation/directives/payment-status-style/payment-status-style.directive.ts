import {Directive, effect, ElementRef, inject, input} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {PaymentStatusEnum} from "@tenant/payment/domain/enum/payment.status.enum";

@Directive({
	selector: '[paymentStatusStyle]',
	standalone: true,
})
export class PaymentStatusStyleDirective {

	public readonly status = input.required();

	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly translateService = inject(TranslateService);

	public constructor() {
		effect(() => {
			this.initActive();
		});
	}

	public initActive(): void {

		this.elementRef.nativeElement.className = '';

		this.elementRef.nativeElement.classList.add('inline-flex', 'items-center', 'gap-x-1.5', 'py-1.5', 'px-3', 'rounded-full', 'text-xs', 'font-medium');

		let text: string;

		switch (this.status()) {

			case PaymentStatusEnum.failed:
				this.elementRef.nativeElement.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-800/30', 'dark:text-red-500');
				text = this.translateService.instant('payment.status.failed.label');
				break;

			case PaymentStatusEnum.registered:
				this.elementRef.nativeElement.classList.add('bg-neutral-100', 'text-neutral-800', 'dark:bg-neutral-800/30', 'dark:text-neutral-500');
				text = this.translateService.instant('payment.status.registered.label');
				break;

			case PaymentStatusEnum.succeeded:
				this.elementRef.nativeElement.classList.add('bg-teal-100', 'text-teal-800', 'dark:bg-teal-800/30', 'dark:text-teal-500');
				text = this.translateService.instant('payment.status.succeeded.label');
				break;

			case PaymentStatusEnum.pending:
				this.elementRef.nativeElement.classList.add('bg-blue-100', 'text-blue-800', 'dark:bg-blue-800/30', 'dark:text-blue-500');
				text = this.translateService.instant('payment.status.pending.label');
				break;

			default:
				this.elementRef.nativeElement.classList.add('bg-neutral-100', 'text-neutral-800', 'dark:bg-neutral-800/30', 'dark:text-neutral-500');
				text = this.translateService.instant('keyword.capitalize.unknown');

		}

		this.elementRef.nativeElement.innerText = text;

	}

}
