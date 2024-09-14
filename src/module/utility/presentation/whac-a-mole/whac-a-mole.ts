import {
	ChangeDetectorRef,
	Component,
	ComponentRef,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	Input,
	OnInit,
	reflectComponentType,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Reactive} from "@utility/cdk/reactive";
import {WhacAMoleContainer} from "@utility/presentation/whac-a-mole/whac-a-mole.container";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {WhacAMoleBuildItArgsType} from "@utility/presentation/whac-a-mole/whac-a-mole.type";
import {WhacAMoleWrapper} from "@utility/presentation/whac-a-mole/whac-a-mole.wrapper";

@Component({
	selector: 'whac-a-mole',
	standalone: true,
	imports: [NgIf, NgForOf, NgClass, TranslateModule, WhacAMoleContainer],
	template: `
		<whac-a-mole-container>
			<ng-container #listOfComponents></ng-container>
		</whac-a-mole-container>
	`
})
export class WhacAMole extends Reactive implements OnInit {
	@Input()
	public id = 'whac-a-mole';

	@HostBinding()
	public class =
		'not-tablet:animate-slideOut hidden tablet:hidden w-full not-tablet:!w-0 absolute top-0 right-0 h-screen z-50 bg-black/50 flex justify-end lg:min-w-[375px] lg:max-w-[375px] lg:relative';

	@ViewChild('listOfComponents', {read: ViewContainerRef, static: true})
	public readonly listOfComponents!: ViewContainerRef;

	// It is for table device
	@HostListener('click', ['$event'])
	public onClick(event: MouseEvent): void {
		if (this.isHidden) {
			return;
		}
		const isHostElement = event.target === this.elementRef.nativeElement;
		if (isHostElement) {
			this.ngxLogger.debug('WhacAMole.onClick', event);
			this.removeLastComponent();
		}
	}

	@HostListener('document:keydown.escape')
	public handleOnEscapeKey(): void {
		this.ngxLogger.debug('handleOnEscapeKey');
		this.removeLastComponent();
	}

	private readonly ngxLogger = inject(NGXLogger);
	private readonly whacAMoleProvider = inject(WhacAMoleProvider);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

	public ngOnInit() {
		this.whacAMoleProvider.registerContainer(this);
	}

	public destroyComponent(key: string): boolean {
		const componentRef = this.whacAMoleProvider.componentRefMapById.get(key);
		componentRef?.destroy();
		this.whacAMoleProvider.componentRefMapById.delete(key);
		this.updateVisibility();

		return !!componentRef;
	}

	public removeLastComponent(): boolean {
		const lastComponent = Array.from(this.whacAMoleProvider.componentRefMapById.values()).pop() as ComponentRef<
			WhacAMoleWrapper<unknown>
		>;

		if (!lastComponent?.instance.renderedComponent) {
			return false;
		}

		const mirror = reflectComponentType(lastComponent.instance.renderedComponent);
		if (!mirror) {
			this.ngxLogger.error('WhacAMole.removeLastComponent', 'value of `component` property is not a component');
			return false;
		}

		this.destroyComponent(mirror.selector);

		this.updateVisibility();

		return true;
	}

	public buildComponentAndRender({
									   component,
									   componentInputs,
									   title,
									   showLoading,
									   button,
									   callback,
									   id
								   }: WhacAMoleBuildItArgsType) {
		const componentMirror = reflectComponentType(component);

		if (!componentMirror) {
			this.ngxLogger.error('WhacAMole.buildComponentAndRender', 'value of `component` property is not a component');
			return;
		}

		const {selector} = componentMirror;

		const existComponentRef = this.updatePushBoxComponent({
			componentInputs,
			showLoading,
			button,
			component,
			callback
		});

		if (existComponentRef) {
			this.ngxLogger.debug('WhacAMole.buildComponentAndRender', 'Component already exist, moving to the top');

			this.listOfComponents.move(existComponentRef.hostView, 0);

			return existComponentRef;
		}

		this.ngxLogger.debug('WhacAMole.buildComponentAndRender', selector, component);

		const whacAMoleWrapperComponentRef = this.listOfComponents.createComponent(WhacAMoleWrapper, {
			index: 0 // Insert at the beginning
		});
		whacAMoleWrapperComponentRef.setInput('title', title);
		whacAMoleWrapperComponentRef.setInput('id', id ?? selector);
		whacAMoleWrapperComponentRef.setInput('showLoading', showLoading ?? false);
		whacAMoleWrapperComponentRef.setInput('destroySelf', () => {
			callback?.on?.destroy?.before?.();
			this.destroyComponent(id ?? selector);
			callback?.on?.destroy?.after?.();
		});
		whacAMoleWrapperComponentRef.setInput('updateSelfBefore', (componentInputs: Record<string, unknown> | undefined) => {
			callback?.on?.update?.before?.(componentInputs);
		});
		whacAMoleWrapperComponentRef.setInput('updateSelfAfter', (componentInputs: Record<string, unknown> | undefined) => {
			callback?.on?.update?.after?.(componentInputs);
		});
		whacAMoleWrapperComponentRef.onDestroy(() => {
			this.destroyComponent(id ?? selector);
		});

		if (button) {
			whacAMoleWrapperComponentRef.setInput('button', button);
		}

		whacAMoleWrapperComponentRef.instance.renderComponent(component, componentInputs);
		this.whacAMoleProvider.componentRefMapById.set(id ?? selector, whacAMoleWrapperComponentRef);
		if (!this.whacAMoleProvider.componentRefMapByComponentName.has(selector)) {
			this.whacAMoleProvider.componentRefMapByComponentName.set(selector, []);
		}
		this.whacAMoleProvider.componentRefMapByComponentName.get(selector)?.push(whacAMoleWrapperComponentRef);
		this.updateVisibility();

		return whacAMoleWrapperComponentRef;
	}

	public updatePushBoxComponent({componentInputs, showLoading, component, callback, id}: WhacAMoleBuildItArgsType) {
		const componentMirror = reflectComponentType(component);

		if (!componentMirror) {
			this.ngxLogger.error('WhacAMole.buildComponentAndRender', 'value of `component` property is not a component');
			return;
		}

		const componentRef = this.whacAMoleProvider.componentRefMapById.get(id ?? componentMirror.selector);
		if (!componentRef) {
			this.ngxLogger.debug('WhacAMole.updatePushBoxComponent', 'Component does not exist');
			return;
		}

		const wasLoading = componentRef.instance.showLoading;
		componentRef.setInput('showLoading', showLoading ?? false);

		componentRef.instance.updateSelfBefore(componentInputs);

		// Render the component if it was loading and now it's not
		if (wasLoading && !showLoading) {
			componentRef.instance.renderComponent(component, componentInputs);
		}

		// Update the inputs if the component was not loading and still is not loading
		if (!wasLoading && !showLoading && componentInputs) {
			Object.entries(componentInputs).forEach(([key, value]) => {
				componentRef.instance.renderedComponentRef?.setInput(key, value);
			});
		}

		componentRef.instance.updateSelfAfter(componentInputs);

		if (callback?.on?.update?.before) {
			componentRef.setInput('updateSelfBefore', callback?.on?.update?.before);
		}

		if (callback?.on?.update?.after) {
			componentRef.setInput('updateSelfAfter', callback?.on?.update?.after);
		}

		componentRef.setInput('destroySelf', () => {
			callback?.on?.destroy?.before?.();
			this.destroyComponent(id ?? componentMirror.selector);
			callback?.on?.destroy?.after?.();
		});

		this.updateVisibility();

		return componentRef;
	}

	private get isHidden(): boolean {
		return this.elementRef.nativeElement.classList.contains('hidden');
	}

	private updateVisibility(hidden?: boolean): void {
		const thereAreNoComponents = !this.whacAMoleProvider.componentRefMapById.size;
		hidden = hidden ?? thereAreNoComponents;
		this.elementRef.nativeElement.classList.toggle('tablet:hidden', hidden);
		this.elementRef.nativeElement.classList.toggle('not-tablet:!w-0', hidden);
		this.elementRef.nativeElement.classList.toggle('not-tablet:animate-slideOut', hidden);
		this.elementRef.nativeElement.classList.toggle('not-tablet:animate-slideIn', !hidden);
		if (hidden) {
			setTimeout(() => {
				this.elementRef.nativeElement.classList.toggle('hidden', hidden);
			}, 300);
		} else {
			this.elementRef.nativeElement.classList.toggle('hidden', hidden);
		}
		this.changeDetectorRef.detectChanges();
	}
}
