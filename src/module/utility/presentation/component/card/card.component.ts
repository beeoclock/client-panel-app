import {
	Component,
	ElementRef,
	HostBinding,
	inject,
	Input,
	OnChanges,
	OnInit,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation
} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
	selector: 'bee-card',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		NgIf,
		NgClass
	],
	template: `
		<ng-content></ng-content>
	`
})
export class CardComponent implements OnChanges, OnInit {

	@Input()
	public gap: 'gap-0' | 'gap-4' | 'gap-1' | 'gap-2' | 'gap-3' | 'gap-8' = 'gap-4';

	@Input()
	public padding = 'p-4';

	@Input()
	public width: 'auto' | '96' | string = 'auto';

	@Input()
	public useBorder = true;

	@Input()
	public flexCol = true;

	@Input()
	public borderColor = 'border-beeColor-200';

	@Input()
	public darkBorderColor = 'dark:border-beeDarkColor-700';

	@HostBinding('class')
	public hostClass = 'bg-white dark:text-white dark:bg-beeDarkColor-800/50 rounded-2xl flex';

	private readonly elementRef = inject(ElementRef);

	public ngOnChanges(changes: SimpleChanges & {
		gap: SimpleChange;
		padding: SimpleChange;
		width: SimpleChange;
		useBorder: SimpleChange;
		borderColor: SimpleChange;
		darkBorderColor: SimpleChange;
		flexCol: SimpleChange;
	}): void {

		if (changes.gap) {
			const newClass = this.hostClass.replace(changes.gap.previousValue, changes.gap.currentValue);
			if (this.hostClass === newClass) {
				this.hostClass += ` ${changes.gap.currentValue}`;
			}
		}

		if (changes.padding) {
			const newClass = this.hostClass.replace(changes.padding.previousValue, changes.padding.currentValue);
			if (this.hostClass === newClass) {
				this.hostClass += ` ${changes.padding.currentValue}`;
			}
		}

		if (changes.width) {
			const newClass = this.hostClass.replace(changes.width.previousValue, changes.width.currentValue);
			if (this.hostClass === newClass) {
				this.hostClass += ` ${changes.width.currentValue}`;
			}
		}

		if (changes.useBorder) {
			this.elementRef.nativeElement.classList.toggle('border', changes.useBorder.currentValue);
		}

		if (changes.flexCol) {
			this.elementRef.nativeElement.classList.toggle('flex-col', changes.flexCol.currentValue);
		}

		if (changes.borderColor) {
			const newClass = this.hostClass.replace(changes.borderColor.previousValue, changes.borderColor.currentValue);
			if (this.hostClass === newClass) {
				this.hostClass += ` ${changes.borderColor.currentValue}`;
			}
		}

		if (changes.darkBorderColor) {
			const newClass = this.hostClass.replace(changes.darkBorderColor.previousValue, changes.darkBorderColor.currentValue);
			if (this.hostClass === newClass) {
				this.hostClass += ` ${changes.darkBorderColor.currentValue}`;
			}
		}

	}

	public ngOnInit(): void {
		this.hostClass += ` ${this.gap} ${this.padding} ${this.width} ${this.borderColor} ${this.darkBorderColor}`;
		this.elementRef.nativeElement.classList.toggle('border', this.useBorder);
		this.elementRef.nativeElement.classList.toggle('flex-col', this.flexCol);
	}

}
