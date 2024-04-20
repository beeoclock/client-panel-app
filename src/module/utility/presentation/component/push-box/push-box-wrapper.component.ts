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

@Component({
	selector: 'utility-push-box-wrapper',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="flex justify-between p-2">
			<span>{{ title }}</span>
			<div class="flex gap-2">
				<button type="button" class="hover:bg-beeColor-200 p-2 px-3 rounded-lg transition-all" (click)="destroySelf()" title="Close">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
		</div>
		<ng-container #renderContainer></ng-container>
	`
})
export class PushBoxWrapperComponent {

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

		this.renderedComponent = component;

		const componentRef = this.renderContainer.createComponent(component);
		componentRef.location.nativeElement.classList.add('h-screen', 'overflow-y-auto');

		this.renderedComponentRef = componentRef;

		inputs && Object.entries(inputs).forEach(({0: key, 1: value}) => {
			componentRef.setInput(key, value)
		});

	}

}
