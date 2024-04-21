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

	public destroyComponent(componentType: PushBoxBuildItArgsType['component']): boolean {
		const componentRef = this.pushBoxService.componentRefMap.get(componentType.name);
		componentRef?.destroy();
		this.pushBoxService.componentRefMap.delete(componentType.name);
		this.updateVisibility();

		return !!componentRef;
	}

	public removeLastComponent(): boolean {
		const lastComponent = Array.from(this.pushBoxService.componentRefMap.values()).pop();
		if (!lastComponent || !lastComponent.instance.renderedComponent) {
			return false;
		}
		lastComponent && this.destroyComponent(lastComponent.instance.renderedComponent);

		return !!lastComponent;
	}

	public buildComponentAndRender({component, componentInputs, title}: PushBoxBuildItArgsType) {

		if (this.pushBoxService.componentRefMap.has(component.name)) {
			this.ngxLogger.debug('PushBoxComponent.observe$ componentRefMap.has', component.name);
			this.destroyComponent(component);
		}

		this.ngxLogger.debug('PushBoxComponent.observe$', component);

		const pushBoxWrapperComponentRef = this.listOfComponents.createComponent(PushBoxWrapperComponent, {
			index: 0
		});
		pushBoxWrapperComponentRef.setInput('title', title);
		pushBoxWrapperComponentRef.setInput('destroySelf', () => {
			this.destroyComponent(component);
		});
		pushBoxWrapperComponentRef.instance.renderComponent(component, componentInputs);
		this.pushBoxService.componentRefMap.set(component.name, pushBoxWrapperComponentRef);
		this.updateVisibility();

		return pushBoxWrapperComponentRef;

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
		const thereAreNoComponents = !this.pushBoxService.componentRefMap.size;
		hidden = hidden ?? thereAreNoComponents;
		this.elementRef.nativeElement.classList.toggle('hidden', hidden);
		this.changeDetectorRef.detectChanges();
	}


}
