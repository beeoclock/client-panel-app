import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	Input,
	OnInit,
	ViewChild,
	ViewContainerRef
} from "@angular/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {DebounceClickDirective} from "@utility/presentation/directives/debounce/debounce.directive";
import {NGXLogger} from "ngx-logger";
import {PushBoxBuildItArgsType, PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {PushBoxWrapperComponent} from "@utility/presentation/component/push-box/push-box-wrapper.component";
import {PushBoxContainerComponent} from "@utility/presentation/component/push-box/push-box.container.component";
import {uuid} from "typia/lib/utils/RandomGenerator/RandomGenerator";

@Component({
	selector: 'utility-push-box',
	standalone: true,
	imports: [
		NgIf,
		NgForOf,
		NgClass,
		DebounceClickDirective,
		LoaderComponent,
		TranslateModule,
		PushBoxContainerComponent
	],
	template: `
		<utility-push-box-container>
			<ng-container #listOfComponents/>
		</utility-push-box-container>
	`
})
export class PushBoxComponent extends Reactive implements OnInit {

	@Input()
	public id = 'push-box';

	@HostBinding()
	public class = 'hidden absolute top-0 right-0 h-dvh z-50 w-full bg-black/50 flex justify-end lg:min-w-[375px] lg:max-w-[375px] lg:relative';

	@ViewChild('listOfComponents', {read: ViewContainerRef, static: true})
	public readonly listOfComponents!: ViewContainerRef;

	@HostListener('click', ['$event'])
	public onClick(event: MouseEvent): void {
		if (this.isHidden) {
			return;
		}
		// Check if target is the host element
		if (event.target === this.elementRef.nativeElement) {
			this.ngxLogger.debug('PushBoxComponent.onClick', event);
			this.removeLastComponent();
		}
	}

	private readonly ngxLogger = inject(NGXLogger);
	private readonly pushBoxService = inject(PushBoxService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

	public ngOnInit() {
		this.pushBoxService.registerContainer(this);
	}

	public destroyComponent(id: string): boolean {
		const componentRef = this.pushBoxService.componentRefMapById.get(id);
		componentRef?.destroy();
		this.pushBoxService.componentRefMapById.delete(id);
		this.updateVisibility();

		return !!componentRef;
	}

	public removeLastComponent(): boolean {
		const lastComponent = Array.from(this.pushBoxService.componentRefMapById.values()).pop();
		if (!lastComponent || !lastComponent.instance.renderedComponent) {
			return false;
		}
		lastComponent && this.destroyComponent(lastComponent.instance.id);

		this.updateVisibility();

		return !!lastComponent;
	}

	public buildComponentAndRender(
		{
			component,
			componentInputs,
			title,
			showLoading,
			button,
			id,
			useComponentNameAsPrefixOfId
		}: PushBoxBuildItArgsType
	) {

		if (useComponentNameAsPrefixOfId) {

			id = `${component.name}_${id ?? uuid()}`;

		} else {

			id = id ?? component.name;

		}

		if (this.pushBoxService.componentRefMapById.has(id)) {
			const componentRef = this.updatePushBoxComponent({
				id, componentInputs, showLoading, button,
				useComponentNameAsPrefixOfId, component
			})
			return componentRef;
		}

		this.ngxLogger.debug('PushBoxComponent.observe$', component);

		const pushBoxWrapperComponentRef = this.listOfComponents.createComponent(
			PushBoxWrapperComponent,
			{
				index: 0 // Insert at the beginning
			}
		);
		pushBoxWrapperComponentRef.setInput('title', title);
		pushBoxWrapperComponentRef.setInput('id', id);
		pushBoxWrapperComponentRef.setInput('showLoading', showLoading ?? false);
		pushBoxWrapperComponentRef.setInput('destroySelf', () => {
			// TODO: Add before destroy to
			this.destroyComponent(id);
			// TODO: Add after destroy to
		});

		if (button) {
			pushBoxWrapperComponentRef.setInput('button', button);
		}

		pushBoxWrapperComponentRef.instance.renderComponent(component, componentInputs);
		this.pushBoxService.componentRefMapById.set(id, pushBoxWrapperComponentRef);
		if (!this.pushBoxService.componentRefMapByComponentName.has(component.name)) {
			this.pushBoxService.componentRefMapByComponentName.set(component.name, []);
		}
		this.pushBoxService.componentRefMapByComponentName.get(component.name)?.push(pushBoxWrapperComponentRef);
		this.updateVisibility();

		return pushBoxWrapperComponentRef;

	}

	public updatePushBoxComponent(
		{
			id,
			componentInputs,
			showLoading,
			useComponentNameAsPrefixOfId,
			component
		}: PushBoxBuildItArgsType
	) {
		if (useComponentNameAsPrefixOfId) {

			id = `${component.name}_${id ?? uuid()}`;

		} else {

			id = id ?? component.name;

		}

		const componentRef = this.pushBoxService.componentRefMapById.get(id);
		if (!componentRef) {
			return;
		}
		const wasLoading = componentRef.instance.showLoading;
		componentRef.setInput('showLoading', showLoading ?? false);
		// If the component was loading and now is not loading, render the component
		wasLoading && !showLoading && componentRef.instance.renderComponent(component, componentInputs)
		// If the component was not loading and now component is not loading, update the inputs
		!wasLoading && !showLoading && componentInputs && Object.entries(componentInputs).forEach(({0: key, 1: value}) => {
			componentRef.instance.renderedComponentRef?.setInput(key, value);
		});
		this.updateVisibility();
		return componentRef;
	}

	@HostListener('document:keydown.escape')
	private handleOnEscapeKey(): void {
		this.ngxLogger.debug('handleOnEscapeKey');
		this.removeLastComponent();
	}

	private get isHidden(): boolean {
		return this.elementRef.nativeElement.classList.contains('hidden');
	}

	private updateVisibility(hidden?: boolean): void {
		const thereAreNoComponents = !this.pushBoxService.componentRefMapById.size;
		hidden = hidden ?? thereAreNoComponents;
		this.elementRef.nativeElement.classList.toggle('hidden', hidden);
		this.changeDetectorRef.detectChanges();
	}


}
