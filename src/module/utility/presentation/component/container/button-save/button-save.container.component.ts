import {Component, HostBinding, ViewEncapsulation} from "@angular/core";

@Component({
	selector: 'utility-button-save-container-component',
	standalone: true,
	template: `
		<ng-content/>
	`,
	encapsulation: ViewEncapsulation.None
})
export class ButtonSaveContainerComponent {
	@HostBinding()
	public class = 'block bg-white dark:text-white dark:bg-beeDarkColor-800/50 rounded-2xl z-40 w-full p-4 border sticky bottom-16';
}
