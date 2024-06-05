import {ComponentRef, inject, Injectable, reflectComponentType, Type} from "@angular/core";
import {WhacAMoleWrapper} from "@utility/presentation/whac-a-mole/whac-a-mole.wrapper";
import {WhacAMole} from "@utility/presentation/whac-a-mole/whac-a-mole";
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
	};
	callback?: {
		on?: {
			destroy?: {
				before?: () => void;
				after?: () => void;
			};
		};
	};
}


@Injectable({
	providedIn: 'root'
})
export class WhacAMoleProvider<COMPONENT> {

	private pushBoxContainer: WhacAMole | undefined;

	public readonly componentRefMapById = new Map<string, ComponentRef<WhacAMoleWrapper<COMPONENT>>>();
	public readonly componentRefMapByComponentName = new Map<string, ComponentRef<WhacAMoleWrapper<COMPONENT>>[]>();

	private readonly ngxLogger = inject(NGXLogger);

	public async destroyComponent(component: Type<unknown>) {

		const componentMirror = reflectComponentType(component);

		if (!componentMirror) {
			this.ngxLogger.error('WhacAMole.buildComponentAndRender', 'value of `component` property is not a component');
			return false;
		}

		const {selector} = componentMirror;

		const componentRefList = this.componentRefMapByComponentName.get(selector);

		if (!componentRefList?.length) {
			this.ngxLogger.debug('WhacAMole.destroyComponent Did not find', selector, this);
			return false;
		}

		this.ngxLogger.debug('WhacAMole.destroyComponent', selector);

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

		return new Promise<ComponentRef<WhacAMoleWrapper<COMPONENT>>>((resolve, reject) => {
			const componentRef = this.pushBoxContainer?.updatePushBoxComponent?.(args);
			!componentRef ? reject() : resolve(componentRef);
		});

	}

	public registerContainer(pushBoxContainer: WhacAMole) {
		this.pushBoxContainer = pushBoxContainer;
	}
}
