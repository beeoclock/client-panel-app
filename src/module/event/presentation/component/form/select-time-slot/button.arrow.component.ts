import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'event-select-time-slot-button-arrow-component',
	template: `
		<button type="button"
				[disabled]="disabled"
				class="px-3 py-2 hover:bg-beeColor-300 dark:hover:bg-beeDarkColor-800 cursor-pointer rounded-2xl">
			@if (left) {
				<app-icon name="bootstrapChevronLeft"/>
			} @else {
				<app-icon name="bootstrapChevronRight"/>
			}
		</button>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		IconComponent
	],
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
