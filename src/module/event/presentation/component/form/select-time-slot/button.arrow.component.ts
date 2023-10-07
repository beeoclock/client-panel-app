import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";

@Component({
	selector: 'event-select-time-slot-button-arrow-component',
	template: `
		<button type="button"
						[disabled]="disabled"
						class="px-3 py-2 hover:bg-beeColor-300 dark:hover:bg-beeDarkColor-800 cursor-pointer rounded-2xl">
			<i class="bi" [class.bi-chevron-left]="left" [class.bi-chevron-right]="right"></i>
		</button>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonArrowComponent {
	@Input()
	public left = false;

	@Input()
	public right = false;

	@Input()
	public disabled = false;
}
