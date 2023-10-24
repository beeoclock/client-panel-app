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
	public class = 'md:block max-md:fixed bottom-0 bg-white dark:text-white dark:bg-beeDarkColor-800/50 md:rounded-2xl flex flex-col z-40 w-full p-4 border-t md:border';
}
