import {
	Component,
	ComponentRef,
	EnvironmentInjector,
	HostBinding,
	Injector,
	Input,
	input,
	Type,
	viewChild,
	ViewContainerRef,
	ViewEncapsulation
} from '@angular/core';
import {WhacAMoleBuildItArgsType} from "@shared/presentation/whac-a-mole/whac-a-mole.type";

@Component({
	selector: 'whac-a-mole-wrapper',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="flex justify-between p-1 border-b">
			<div class="truncate font-bold p-2">{{ title() }}</div>
			<div class="flex gap-2">
				<button
					type="button"
					class="hover:bg-neutral-200 p-2 px-3 rounded-lg transition-all"
					(click)="doDone()"
					[title]="button?.close?.title ?? ''"
				>
					@if (button?.close?.text) {

						<span [class]="button?.close?.classList ?? ''">
							{{ button?.close?.text }}
						  </span>
					}
					@if (button?.close?.useDefaultIcon ?? false) {

						<i class="bi bi-x-lg"></i>
					}
				</button>
			</div>
		</div>
		@if (showLoading()) {

			<div
				role="status"
				class="animate-pulse bg-gray-300 dark:bg-gray-700 flex h-dvh items-center justify-center m-1 rounded-lg">
				<span class="sr-only">Loading...</span>
			</div>
		}

		<ng-container #renderContainer></ng-container>
	`
})
export class WhacAMoleWrapper<COMPONENT> {
	public readonly showLoading = input(true);

	@HostBinding()
	@Input() // Required
	public id!: string;

	public readonly title = input('Title');

	@Input()
	public button: WhacAMoleBuildItArgsType['button'] = {
		close: {
			title: 'Close',
			useDefaultIcon: true
		}
	};

	public readonly destroySelf = input(() => {
	});

	public readonly updateSelfBefore = input((componentInputs: Record<string, unknown> | undefined) => {
	});

	public readonly updateSelfAfter = input((componentInputs: Record<string, unknown> | undefined) => {
	});

	readonly renderContainer = viewChild.required('renderContainer', {read: ViewContainerRef});

	@HostBinding()
	public class = 'flex flex-col h-dvh';

	public renderedComponent: Type<COMPONENT> | undefined;
	public renderedComponentRef: ComponentRef<COMPONENT> | undefined;

	public doDone() {
		this.destroySelf()();
	}

	public renderComponent(component: Type<COMPONENT>, inputs?: Record<string, unknown>, options?: {
		index?: number;
		injector?: Injector;
		environmentInjector?: EnvironmentInjector;
		projectableNodes?: Node[][];
	}) {
		if (this.showLoading()) {
			return;
		}

		this.renderedComponent = component;

		const componentRef = this.renderContainer().createComponent(component, options);
		componentRef.location.nativeElement.classList.add('min-h-[calc(100%-50px)]', 'h-screen', 'overflow-y-auto');

		this.renderedComponentRef = componentRef;

		inputs &&
		Object.entries(inputs).forEach(({0: key, 1: value}) => {
			componentRef.setInput(key, value);
		});

		componentRef.changeDetectorRef.detectChanges();

		return componentRef;
	}
}
