import {Directive, effect, ElementRef, inject, input} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {StateEnum} from "@utility/domain/enum/state.enum";

@Directive({
	selector: '[activeStyle]',
	standalone: true,
})
export class ActiveStyleDirective {

	public readonly state = input<StateEnum>(StateEnum.active);

	public readonly activeText = input<string>();
	public readonly inactiveText = input<string>();
	public readonly archiveText = input<string>();

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

		switch (this.state()) {

			case StateEnum.archived:
				this.elementRef.nativeElement.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-800/30', 'dark:text-red-500');
				text = this.archiveText() ?? this.translateService.instant('keyword.capitalize.archived');
				break;

			case StateEnum.inactive:
				this.elementRef.nativeElement.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-800/30', 'dark:text-red-500');
				text = this.inactiveText() ?? this.translateService.instant('keyword.capitalize.inactive');
				break;

			case StateEnum.active:
				this.elementRef.nativeElement.classList.add('bg-teal-100', 'text-teal-800', 'dark:bg-teal-800/30', 'dark:text-teal-500');
				text = this.activeText() ?? this.translateService.instant('keyword.capitalize.active');
				break;

			case StateEnum.deleted:
				this.elementRef.nativeElement.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-800/30', 'dark:text-red-500');
				text = this.activeText() ?? this.translateService.instant('keyword.capitalize.deleted');
				break;

			default:
				this.elementRef.nativeElement.classList.add('bg-neutral-100', 'text-neutral-800', 'dark:bg-neutral-800/30', 'dark:text-neutral-500');
				text = this.activeText() ?? this.translateService.instant('keyword.capitalize.unknown');

		}

		this.elementRef.nativeElement.innerText = text;

	}

}
