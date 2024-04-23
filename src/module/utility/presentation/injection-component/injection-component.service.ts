import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	EmbeddedViewRef,
	inject,
	Injectable,
	Injector,
	NgModuleRef,
	Type
} from '@angular/core';
import {AppComponent} from "@src/app.component";

@Injectable({
	providedIn: 'root'
})
export class InjectionComponentService {

	private _container: ComponentRef<unknown> | undefined;

	private readonly applicationRef = inject(ApplicationRef);
	private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
	private readonly injector = inject(Injector);

	/**
	 * Gets the root view container to inject the component to.
	 *
	 * @returns {ComponentRef<any>}
	 *
	 * @memberOf InjectionComponentService
	 */
	public getRootViewContainer(): ComponentRef<unknown> {
		if (this._container) {
			return this._container;
		}

		const rootComponents = this.applicationRef.components;
		if (rootComponents?.length) {
			return rootComponents[0];
		}

		return this.getComponentRef(AppComponent);

		// throw new Error('View Container not found! ngUpgrade needs to manually set this via setRootViewContainer.');
	}

	/**
	 * Overrides the default root view container. This is useful for
	 * things like ngUpgrade that doesn't have a ApplicationRef root.
	 *
	 * @param {any} container
	 *
	 * @memberOf InjectionComponentService
	 */
	public setRootViewContainer(container: ComponentRef<unknown>): void {
		this._container = container;
	}

	/**
	 * Gets the html element for a component ref.
	 *
	 * @param {ComponentRef<any>} componentRef
	 * @returns {HTMLElement}
	 *
	 * @memberOf InjectionComponentService
	 */
	public getComponentRootNode(componentRef: ComponentRef<unknown>): HTMLElement {
		return (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
	}

	/**
	 * Gets the root component container html element.
	 *
	 * @returns {HTMLElement}
	 *
	 * @memberOf InjectionComponentService
	 */
	public getRootViewContainerNode(): HTMLElement {
		return this.getComponentRootNode(this.getRootViewContainer());
	}

	/**
	 * Projects the inputs onto the component
	 *
	 * @param {ComponentRef<any>} component
	 * @param {*} options
	 * @returns {ComponentRef<any>}
	 *
	 * @memberOf InjectionComponentService
	 */
	public projectComponentInputs(component: ComponentRef<unknown>, options: unknown): ComponentRef<unknown> {
		if (options) {
			const props = Object.getOwnPropertyNames(options);
			for (const prop of props) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				component.instance[prop] = options[prop];
			}
		}

		return component;
	}

	/**
	 * Appends a component to a adjacent location
	 *
	 * @template T
	 * @param {Type<T>} componentClass
	 * @param {*} [options={}]
	 * @param projectableNodes
	 * @param rootSelectorOrNode
	 * @param ngModule
	 * @param location
	 * @returns {ComponentRef<any>}
	 *
	 * @memberOf InjectionComponentService
	 */
	public appendComponent<T>(
		componentClass: Type<T>,
		options: unknown = {},
		projectableNodes?: Node[][],
		rootSelectorOrNode?: string | unknown,
		ngModule?: NgModuleRef<unknown>,
		location: Element = this.getRootViewContainerNode()
	): ComponentRef<T> {

		const componentRef: ComponentRef<T> = this.getComponentRefAndAssignDataAndRegisterToAppView<T>(componentClass, options, projectableNodes, rootSelectorOrNode, ngModule);

		const componentRootNode: HTMLElement = this.getComponentRootNode(componentRef);

		location.appendChild(componentRootNode);

		return componentRef;
	}

	/**
	 *
	 * @param componentClass
	 * @param options
	 * @param projectableNodes
	 * @param rootSelectorOrNode
	 * @param ngModule
	 */
	public getComponentRefAndAssignDataAndRegisterToAppView<T>(
		componentClass: Type<T>,
		options: unknown = {},
		projectableNodes?: Node[][],
		rootSelectorOrNode?: string | unknown,
		ngModule?: NgModuleRef<unknown>
	): ComponentRef<T> {

		const componentRef: ComponentRef<T> = this.getComponentRefAndAssignData<T>(componentClass, options, projectableNodes, rootSelectorOrNode, ngModule);

		this.registerToApplicationView<T>(componentRef);

		return componentRef;

	}

	/**
	 *
	 * @param componentClass
	 * @param projectableNodes
	 * @param rootSelectorOrNode
	 * @param ngModule
	 */
	public getComponentRef<T>(
		componentClass: Type<T>,
		projectableNodes?: Node[][],
		rootSelectorOrNode?: string | unknown,
		ngModule?: NgModuleRef<unknown>
	): ComponentRef<T> {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory<T>(componentClass);
		return componentFactory.create(this.injector, projectableNodes, rootSelectorOrNode, ngModule);

	}

	/**
	 *
	 * @param componentClass
	 * @param options
	 * @param projectableNodes
	 * @param rootSelectorOrNode
	 * @param ngModule
	 */
	public getComponentRefAndAssignData<T>(
		componentClass: Type<T>,
		options: unknown = {},
		projectableNodes?: Node[][],
		rootSelectorOrNode?: string | unknown,
		ngModule?: NgModuleRef<unknown>
	): ComponentRef<T> {

		const componentRef: ComponentRef<T> = this.getComponentRef<T>(componentClass, projectableNodes, rootSelectorOrNode, ngModule);

		// project the options passed to the component instance
		this.projectComponentInputs(componentRef, options);

		return componentRef;

	}

	/**
	 *
	 * @param componentRef
	 * @private
	 */
	private registerToApplicationView<T>(componentRef: ComponentRef<T>): void {

		// ApplicationRef's attachView and detachView methods are in Angular ^2.2.1 but not before.
		// The `else` clause here can be removed once 2.2.1 is released.
		if (this.applicationRef?.attachView) {
			this.applicationRef.attachView(componentRef.hostView);

			componentRef.onDestroy(() => {
				this.applicationRef.detachView(componentRef.hostView);
			});
		}

	}
}
