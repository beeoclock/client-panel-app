import {ComponentRef, inject, Injectable, reflectComponentType, Type} from "@angular/core";
import {PushBoxWrapperComponent} from "@utility/presentation/component/push-box/push-box-wrapper.component";
import {PushBoxComponent} from "@utility/presentation/component/push-box/push-box.component";
import {NGXLogger} from "ngx-logger";

export type PushBoxBuildItArgsType = {
	component: Type<unknown>;
	componentInputs?: Record<string, unknown>;
	//
	title?: string;
	showLoading?: boolean;
	button?: {
		close?: {
			classList?: string[];
			title?: string;
			useDefaultIcon?: boolean;
			text?: string;
			callback?: () => void;
		}
	}
}


@Injectable({
	providedIn: 'root'
})
export class PushBoxService<COMPONENT> {

	private pushBoxContainer: PushBoxComponent | undefined;

	public readonly componentRefMapById = new Map<string, ComponentRef<PushBoxWrapperComponent<COMPONENT>>>();
	public readonly componentRefMapByComponentName = new Map<string, ComponentRef<PushBoxWrapperComponent<COMPONENT>>[]>();

	private readonly ngxLogger = inject(NGXLogger);

	public async destroyComponent(component: Type<unknown>) {

		const componentMirror = reflectComponentType(component);

		if (!componentMirror) {
			this.ngxLogger.error('PushBoxComponent.buildComponentAndRender', 'value of `component` property is not a component');
			return false;
		}

		const {selector} = componentMirror;

		const componentRefList = this.componentRefMapByComponentName.get(selector);

		if (!componentRefList?.length) {
			this.ngxLogger.debug('PushBoxComponent.destroyComponent Did not find', selector, this);
			return false;
		}

		this.ngxLogger.debug('PushBoxComponent.destroyComponent', selector);

		componentRefList.forEach((componentRef) => {
			componentRef.instance.destroySelf();
		});

		this.componentRefMapByComponentName.delete(selector);

		return true;

	}

	public async buildItAsync(args: PushBoxBuildItArgsType) {
		const componentRef = this.pushBoxContainer?.buildComponentAndRender?.(args);
		console.log('buildItAsync:componentRef', componentRef)
		return componentRef;
	}

	public updatePushBoxComponentAsync(args: PushBoxBuildItArgsType) {

		return new Promise<ComponentRef<PushBoxWrapperComponent<COMPONENT>>>((resolve, reject) => {
			const componentRef = this.pushBoxContainer?.updatePushBoxComponent?.(args);
			!componentRef ? reject() : resolve(componentRef);
		});

	}

	public registerContainer(pushBoxContainer: PushBoxComponent) {
		this.pushBoxContainer = pushBoxContainer;
	}
}
