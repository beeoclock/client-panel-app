import {ComponentRef, inject, Injectable, Type} from "@angular/core";
import {Subject} from "rxjs";
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

    public readonly buildIt$ = new Subject<PushBoxBuildItArgsType>();

    public readonly destroy$ = new Subject<string>();
    // It will destroy all components with the same component name
    public readonly destroyByComponentName$ = new Subject<string>();

    public readonly componentRefMapById = new Map<string, ComponentRef<PushBoxWrapperComponent<COMPONENT>>>();
    public readonly componentRefMapByComponentName = new Map<string, ComponentRef<PushBoxWrapperComponent<COMPONENT>>[]>();

    private readonly ngxLogger = inject(NGXLogger);

    constructor() {

        const emptyFunction = () => {
        };

        this.buildIt$.subscribe(this.pushBoxContainer?.buildComponentAndRender?.bind?.(this) ?? emptyFunction);

        this.destroy$.subscribe((id: string) => {

            if (!this.componentRefMapById.has(id)) {
                this.ngxLogger.debug('PushBoxComponent.destroy$ !componentRefMapById.has', id);
                return;
            }

            this.ngxLogger.debug('PushBoxComponent.destroy$', id);

            this.pushBoxContainer?.destroyComponent?.(id);

        });

        this.destroyByComponentName$.subscribe((componentName: string) => {

            const componentRefList = this.componentRefMapByComponentName.get(componentName);

            if (!componentRefList?.length) {
                this.ngxLogger.debug('PushBoxComponent.destroyByComponentName$ Did not find', componentName);
                return;
            }

            this.ngxLogger.debug('PushBoxComponent.destroyByComponentName$', componentName);

            componentRefList.forEach((componentRef) => {
                componentRef.instance.destroySelf();
            });

            this.componentRefMapByComponentName.delete(componentName);

        });
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
