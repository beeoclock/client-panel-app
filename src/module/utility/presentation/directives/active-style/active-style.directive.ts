import {Directive, ElementRef, inject, OnChanges, OnInit, input} from '@angular/core';
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

		this.elementRef.nativeElement.classList.add('px-2', 'py-1', 'flex', 'items-center', 'justify-center', 'h-6', 'text-xs', 'rounded-full', 'border', 'text-white', 'uppercase');

		let text: string;

		switch (this.active()) {

			case ActiveEnum.NO:
				this.elementRef.nativeElement.classList.add('bg-red-500', 'border-red-500', 'dark:bg-red-900', 'dark:text-red-400', 'dark:border-red-800');
				text = this.inactiveText() ?? this.translateService.instant('keyword.capitalize.inactive');
				break;

			case ActiveEnum.YES:
				this.elementRef.nativeElement.classList.add('bg-green-500', 'border-green-500', 'dark:bg-green-900', 'dark:text-green-400', 'dark:border-green-800');
				text = this.activeText() ?? this.translateService.instant('keyword.capitalize.active');
				break;

			default:
				this.elementRef.nativeElement.classList.add('bg-beeColor-500', 'border-beeColor-500', 'dark:bg-beeColor-900', 'dark:text-beeColor-400', 'dark:border-beeColor-800');
				text = this.activeText() ?? this.translateService.instant('keyword.capitalize.unknown');

		}

		this.elementRef.nativeElement.innerText = text;

	}

}
