import {Directive, ElementRef, inject, input, OnChanges, OnInit} from '@angular/core';
import {ActiveEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";

@Directive({
	selector: '[activeStyle]',
	standalone: true,
})
export class ActiveStyleDirective implements OnInit, OnChanges {

	public readonly active = input<ActiveEnum>(ActiveEnum.NO);

	public readonly activeText = input<string>();

	public readonly inactiveText = input<string>();

	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly translateService = inject(TranslateService);

	public ngOnChanges(): void {

		this.initActive();

	}

	public ngOnInit(): void {

		this.initActive();

	}

	public initActive(): void {

		this.elementRef.nativeElement.className = '';

		this.elementRef.nativeElement.classList.add('inline-flex', 'items-center', 'gap-x-1.5', 'py-1.5', 'px-3', 'rounded-full', 'text-xs', 'font-medium');

		let text: string;

		switch (this.active()) {

			case ActiveEnum.NO:
				this.elementRef.nativeElement.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-800/30', 'dark:text-red-500');
				text = this.inactiveText() ?? this.translateService.instant('keyword.capitalize.inactive');
				break;

			case ActiveEnum.YES:
				this.elementRef.nativeElement.classList.add('bg-teal-100', 'text-teal-800', 'dark:bg-teal-800/30', 'dark:text-teal-500');
				text = this.activeText() ?? this.translateService.instant('keyword.capitalize.active');
				break;

			default:
				this.elementRef.nativeElement.classList.add('bg-neutral-100', 'text-neutral-800', 'dark:bg-neutral-800/30', 'dark:text-neutral-500');
				text = this.activeText() ?? this.translateService.instant('keyword.capitalize.unknown');

		}

		this.elementRef.nativeElement.innerText = text;

	}

}
