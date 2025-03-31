import {ElementRef, inject, Pipe} from "@angular/core";

@Pipe({
	name: 'noData',
	standalone: true,
	// pure: true,
})
export class NoDataPipe {

	// private readonly translateService = inject(TranslateService);
	private readonly elementRef = inject(ElementRef<HTMLDivElement>);
	private readonly translateKey = 'keyword.lowercase.no-data';

	public transform(value: any, ...args: any[]): any {
		// let result = value ?? this.translateKey;
		let result = value ?? '-';
		if (value !== result) {
			this.elementRef.nativeElement.parentElement.classList.add('text-beeColor-300', 'dark:text-beeDarkColor-500', 'italic');
			// result = this.translateService.instant(this.translateKey);
			result = '-';
		}
		return result;
	}

}
