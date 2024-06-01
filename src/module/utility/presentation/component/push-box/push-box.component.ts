import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	Input,
	OnInit,
	reflectComponentType,
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

	public destroyComponent(key: string): boolean {
		const componentRef = this.pushBoxService.componentRefMapById.get(key);
		componentRef?.destroy();
		this.pushBoxService.componentRefMapById.delete(key);
		this.updateVisibility();

		return !!componentRef;
	}

	public removeLastComponent(): boolean {
		const lastComponent = Array.from(this.pushBoxService.componentRefMapById.values()).pop();
		if (!lastComponent || !lastComponent.instance.renderedComponent) {
			return false;
		}
		const mirror = reflectComponentType(lastComponent.instance.renderedComponent);
		if (!mirror) {
			this.ngxLogger.error('PushBoxComponent.removeLastComponent', 'value of `component` property is not a component');
			return false;
		}
		const { selector } = mirror;
		lastComponent && this.destroyComponent(selector);

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
			callback
		}: PushBoxBuildItArgsType
	) {

		const componentMirror = reflectComponentType(component);

		if (!componentMirror) {
			this.ngxLogger.error('PushBoxComponent.buildComponentAndRender', 'value of `component` property is not a component');
			return;
		}

		const { selector } = componentMirror;

		const existComponentRef = this.updatePushBoxComponent({
			componentInputs, showLoading, button, component
		});

		if (existComponentRef) {

			this.ngxLogger.debug('PushBoxComponent.buildComponentAndRender', 'Component already exist, moving to the top');

			this.listOfComponents.move(existComponentRef.hostView, 0);

			return existComponentRef;
		}

		this.ngxLogger.debug('PushBoxComponent.buildComponentAndRender', selector, component);

		const pushBoxWrapperComponentRef = this.listOfComponents.createComponent(
			PushBoxWrapperComponent,
			{
				index: 0 // Insert at the beginning
			}
		);
		pushBoxWrapperComponentRef.setInput('title', title);
		pushBoxWrapperComponentRef.setInput('id', selector);
		pushBoxWrapperComponentRef.setInput('showLoading', showLoading ?? false);
		pushBoxWrapperComponentRef.setInput('destroySelf', () => {
			callback?.on?.destroy?.before?.();
			this.destroyComponent(selector);
			callback?.on?.destroy?.after?.();
		});

		if (button) {
			pushBoxWrapperComponentRef.setInput('button', button);
		}

		pushBoxWrapperComponentRef.instance.renderComponent(component, componentInputs);
		this.pushBoxService.componentRefMapById.set(selector, pushBoxWrapperComponentRef);
		if (!this.pushBoxService.componentRefMapByComponentName.has(selector)) {
			this.pushBoxService.componentRefMapByComponentName.set(selector, []);
		}
		this.pushBoxService.componentRefMapByComponentName.get(selector)?.push(pushBoxWrapperComponentRef);
		this.updateVisibility();

		return pushBoxWrapperComponentRef;

	}

	public updatePushBoxComponent(
		{
			componentInputs,
			showLoading,
			component
		}: PushBoxBuildItArgsType
	) {

		const componentMirror = reflectComponentType(component);

		if (!componentMirror) {
			this.ngxLogger.error('PushBoxComponent.buildComponentAndRender', 'value of `component` property is not a component');
			return;
		}

		const { selector } = componentMirror;

		const componentRef = this.pushBoxService.componentRefMapById.get(selector);
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
