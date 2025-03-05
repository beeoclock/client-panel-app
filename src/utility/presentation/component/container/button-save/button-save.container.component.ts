import {Component, ViewEncapsulation} from "@angular/core";

@Component({
	selector: 'utility-button-save-container-component',
	standalone: true,
	template: `
		<ng-content/>
	`,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'block bg-white dark:text-white dark:bg-beeDarkColor-800/50 rounded-2xl w-full p-4 border sticky'
	}
})
export class ButtonSaveContainerComponent {
}
