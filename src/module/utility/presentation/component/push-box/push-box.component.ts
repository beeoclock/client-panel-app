import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ComponentRef,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	Input,
	Type,
	ViewChild,
	ViewContainerRef
} from "@angular/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DebounceClickDirective} from "@utility/presentation/directives/debounce/debounce.directive";
import {NGXLogger} from "ngx-logger";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
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
export class PushBoxComponent extends Reactive implements AfterViewInit {

	@Input()
	public id = 'push-box';

	@HostBinding()
	public class = 'absolute top-0 right-0 h-dvh z-50 w-full bg-black/50 flex justify-end lg:min-w-[375px] lg:max-w-[375px] lg:relative';

	@HostBinding('class.hidden')
	public hidden = true;

	@ViewChild('listOfComponents', {read: ViewContainerRef, static: true})
	public readonly listOfComponents!: ViewContainerRef;

	@HostListener('click', ['$event'])
	public onClick(event: MouseEvent): void {
		if (this.hidden) {
			return;
		}
		// Check if target is the host element
		if (event.target === this.elementRef.nativeElement) {
			this.ngxLogger.debug('PushBoxComponent.onClick', event);
			this.removeLastComponent();
		}
	}

	public readonly componentRefMap = new Map<string, ComponentRef<PushBoxWrapperComponent>>();

	private readonly ngxLogger = inject(NGXLogger);
	private readonly translateService = inject(TranslateService);
	private readonly pushBoxService = inject(PushBoxService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly elementRef = inject(ElementRef);

	public readonly buttons = [
		{
			text: this.translateService.instant('keyword.capitalize.cancel'),
			value: false,
			disabled: false,
			enabledDebounceClick: false,
		},
		{
			text: this.translateService.instant('keyword.capitalize.confirm'),
			value: true,
			disabled: false,
			enabledDebounceClick: true,
		}
	];

	public ngAfterViewInit(): void {

		this.pushBoxService.observe$.subscribe(({component, inputs, title}) => {

			if (this.componentRefMap.has(component.name)) {
				this.ngxLogger.debug('PushBoxComponent.observe$ componentRefMap.has', component.name);
				this.destroyComponent(component);
			}

			this.ngxLogger.debug('PushBoxComponent.observe$', component);

			const componentRef = this.listOfComponents.createComponent(PushBoxWrapperComponent, {
				index: 0
			});
			componentRef.setInput('title', title);
			componentRef.setInput('destroySelf', () => {
				this.destroyComponent(component);
			});
			componentRef.instance.renderComponent(component, inputs);
			this.componentRefMap.set(component.name, componentRef);
			this.changeDetectorRef.detectChanges();
			this.showOrHideIfEmpty();

		});

		this.pushBoxService.destroy$.subscribe((componentType) => {

			if (!this.componentRefMap.has(componentType.name)) {
				this.ngxLogger.debug('PushBoxComponent.destroy$ !componentRefMap.has', componentType.name);
				return;
			}

			this.ngxLogger.debug('PushBoxComponent.destroy$', componentType);

			this.destroyComponent(componentType);

		});

	}

	public destroyComponent(componentType: Type<unknown>): void {
		const componentRef = this.componentRefMap.get(componentType.name);
		componentRef?.destroy();
		this.componentRefMap.delete(componentType.name);
		this.changeDetectorRef.detectChanges();
		this.showOrHideIfEmpty();
	}

	public showOrHideIfEmpty(): void {
		this.hidden = !this.componentRefMap.size;
	}

	public removeLastComponent(): void {
		const lastComponent = Array.from(this.componentRefMap.values()).pop();
		if (!lastComponent || !lastComponent.instance.renderedComponent) {
			return;
		}
		lastComponent && this.destroyComponent(lastComponent.instance.renderedComponent);
	}

	@HostListener('document:keydown.escape')
	private handleOnEscapeKey(): void {
		this.ngxLogger.debug('handleOnEscapeKey');
		this.removeLastComponent();
	}


}
