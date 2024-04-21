import {ComponentRef, inject, Injectable, Type} from "@angular/core";
import {Subject} from "rxjs";
import {PushBoxWrapperComponent} from "@utility/presentation/component/push-box/push-box-wrapper.component";
import {PushBoxComponent} from "@utility/presentation/component/push-box/push-box.component";
import {NGXLogger} from "ngx-logger";

export type PushBoxBuildItArgsType = {
	component: Type<unknown>;
	componentInputs?: Record<string, unknown>;
	title?: string;
}

@Injectable({
	providedIn: 'root'
})
export class PushBoxService {

	private pushBoxContainer: PushBoxComponent | undefined;

	public readonly buildIt$ = new Subject<PushBoxBuildItArgsType>();

	public readonly destroy$ = new Subject<Type<unknown>>();

	public readonly componentRefMap = new Map<string, ComponentRef<PushBoxWrapperComponent>>();

	private readonly ngxLogger = inject(NGXLogger);

	constructor() {

		const emptyFunction = () => {};

		this.buildIt$.subscribe(this.pushBoxContainer?.buildComponentAndRender?.bind?.(this) ?? emptyFunction);

		this.destroy$.subscribe((componentType) => {

			if (!this.componentRefMap.has(componentType.name)) {
				this.ngxLogger.debug('PushBoxComponent.destroy$ !componentRefMap.has', componentType.name);
				return;
			}

			this.ngxLogger.debug('PushBoxComponent.destroy$', componentType);

			this.pushBoxContainer?.destroyComponent?.(componentType);

		});
	}

	public buildItAsync(args: PushBoxBuildItArgsType) {

		return new Promise<ComponentRef<PushBoxWrapperComponent>>((resolve, reject) => {
			const componentRef = this.pushBoxContainer?.buildComponentAndRender?.(args);
			!componentRef ? reject() : resolve(componentRef);
		});

	}

	public getComponentRef(componentType: Type<unknown>): ComponentRef<PushBoxWrapperComponent> | undefined {
		return this.componentRefMap.get(componentType.name);
	}

	public registerContainer(pushBoxContainer: PushBoxComponent) {
		this.pushBoxContainer = pushBoxContainer;
	}
}
