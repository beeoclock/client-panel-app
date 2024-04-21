import {
	Component,
	ComponentRef,
	HostBinding,
	Input,
	Type,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation
} from "@angular/core";
import {NgIf} from "@angular/common";

@Component({
	selector: 'utility-push-box-wrapper',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgIf
	],
	template: `
		<div class="flex justify-between p-1 border-b">
			<div class="truncate font-bold p-2">{{ title }}</div>
			<div class="flex gap-2">
				<button type="button" class="hover:bg-beeColor-200 p-2 px-3 rounded-lg transition-all" (click)="destroySelf()"
								title="Close">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
		</div>
		<div *ngIf="showLoading" role="status" class="animate-pulse bg-gray-300 dark:bg-gray-700 flex h-dvh items-center justify-center m-1 rounded-lg">
			<span class="sr-only">Loading...</span>
		</div>

		<ng-container #renderContainer></ng-container>
	`
})
export class PushBoxWrapperComponent {

	@Input()
	public showLoading = true;

	@Input()
	public title = 'Title';

	@Input()
	public destroySelf = () => {
	};

	@ViewChild('renderContainer', {read: ViewContainerRef, static: true})
	private readonly renderContainer!: ViewContainerRef;

	@HostBinding()
	public class = 'flex flex-col h-screen';

	public renderedComponent: Type<any> | undefined;
	public renderedComponentRef: ComponentRef<any> | undefined;

	public renderComponent(component: Type<any>, inputs?: Record<string, any>) {

		if (this.showLoading) {
			return;
		}

		this.renderedComponent = component;

		const componentRef = this.renderContainer.createComponent(component);
		componentRef.location.nativeElement.classList.add('h-screen', 'overflow-y-auto');

		this.renderedComponentRef = componentRef;

		inputs && Object.entries(inputs).forEach(({0: key, 1: value}) => {
			componentRef.setInput(key, value)
		});

	}

}
