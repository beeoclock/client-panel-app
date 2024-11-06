import {ComponentRef, inject, Injectable, Type} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {ModalButtonInterface, ModalComponent,} from "@utility/presentation/component/modal/modal.component";
import {v4} from 'uuid';
import {InjectionComponentService} from "@utility/presentation/injection-component/injection-component.service";
import {is} from "@utility/checker";
import {environment} from "@environments/environment";
import {NGXLogger} from "ngx-logger";

export type storeOfModalsType = Record<string, ComponentRef<ModalComponent>>;

@Injectable({
	providedIn: 'root'
})
export class ModalService {

	readonly #storeOfModals: storeOfModalsType = {};

	private readonly injectionComponentService = inject(InjectionComponentService);
	private readonly ngxLogger = inject(NGXLogger);

	// Used in UT
	public get storeOfModals(): storeOfModalsType {
		return this.#storeOfModals;
	}

	//TODO: the function "createCustomTitle()" should be removed in the future
	@TypeGuard([is.string_not_empty])
	public createCustomTitle(value: string): string {
		return `<div class="subTitleBadge">
              <div class="subTitleWidth titleInline">
                ${value}
              </div>
            </div>`;
	}

	public getModalById<COMPONENT_REF = unknown>(id: string): ComponentRef<ModalComponent<COMPONENT_REF>> | undefined {
		return this.#storeOfModals[id] as ComponentRef<ModalComponent<COMPONENT_REF>>;
	}

	/**
	 * Open, create and set new modal to scope and dom
	 * @param componentList
	 * @param options
	 * @param id
	 */
	@TypeGuard([is.array, null, null])
	public create<T, COMPONENT_REF = unknown>( // TODO make more than 1 T
		componentList: {
			component: Type<T>;
			data: unknown;
		}[],
		options: {
			titleClasses?: string[];
			title?: string;
			id?: string;
			fixHeight?: boolean;
			contentPadding?: boolean;
			showBody?: boolean;
			buttonSectionClass?: string[];
			contentHTML?: string;
			buttons?: ModalButtonInterface<COMPONENT_REF>[];
			componentChildRefList?: ComponentRef<unknown>[];
		} = {},
		id = `${environment.config.modal.prefix}${v4()}`,
	): Promise<ComponentRef<ModalComponent<COMPONENT_REF>>> {
		return new Promise<ComponentRef<ModalComponent<COMPONENT_REF>>>((resolve) => {

			const projectableNodes: Node[][] = [];
			const componentChildRefList: ComponentRef<T>[] = [];
			componentList?.forEach(({component, data}) => {
				const componentRef: ComponentRef<T> = this.injectionComponentService.getComponentRefAndAssignDataAndRegisterToAppView(component, data);
				componentChildRefList.push(componentRef);
				projectableNodes.push([componentRef.location.nativeElement]);
			});

			options = {
				id,
				...options,
				componentChildRefList
			};

			this.#storeOfModals[id] = this.injectionComponentService.appendComponent<ModalComponent<COMPONENT_REF>>(ModalComponent, options, projectableNodes);
			const modal = this.getModalById<COMPONENT_REF>(id);

			if (!modal) {
				throw new Error(`Modal not found, id: ${id}`);
			}

			modal.changeDetectorRef.detectChanges();
			modal.instance.externalMethodOnCloseModalEvent = () => {
				this.close(id);
			};


			// Set modal instance in to each component children if property exist.
			modal.instance.componentChildRefList.forEach((component: ComponentRef<COMPONENT_REF>) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				if ('modalInstance' in component.instance) {
					component.instance.modalInstance = modal.instance;
				}
			});

			resolve(modal);
		});
	}

	/**
	 * Close, delete and clear modal by id or all if id is empty
	 * @param id
	 */
	public close(id: string | null = null): void {
		if (id) {
			// Close only one selected by id modal
			this.closeModalById(id);
		} else {
			// Close all modals
			Object.keys(this.#storeOfModals ?? {}).forEach((key: string) => {
				this.closeModalById(key);
			});
		}
	}

	/**
	 * Just call multi method in current class for close, delete and clear modal in scope nad dom.
	 * @param id
	 * @param force
	 * @private
	 */
	@TypeGuard([is.string_not_empty, is.boolean])
	public closeModalById(id: string, force = true): void {
		if (force) {
			this.deleteModalFromScope(id);
		} else {
			this.#storeOfModals[id].instance.closeModal();
		}
	}

	/**
	 * Delete component from scope and html from dom
	 * @param id
	 * @private
	 */
	@TypeGuard([is.string_not_empty])
	private deleteModalFromScope(id: string): void {
		try {
			if (is.object_not_empty(this.#storeOfModals[id])) {
				if (is.array_not_empty(this.#storeOfModals[id].instance?.componentChildRefList)) {
					this.#storeOfModals[id].instance.componentChildRefList.forEach((componentRef: ComponentRef<unknown>) => {
						componentRef.destroy();
					});
				}
				this.#storeOfModals[id].instance?.modal?.hide?.();
				this.#storeOfModals[id].destroy();
			}
			Reflect.deleteProperty(this.#storeOfModals, id);
		} catch (error) {
			this.ngxLogger.error(error);
		}
	}
}
