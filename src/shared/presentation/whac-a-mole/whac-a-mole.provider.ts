import {ComponentRef, inject, Injectable, reflectComponentType, Type} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {WhacAMoleBuildItArgsType} from "@shared/presentation/whac-a-mole/whac-a-mole.type";
import {WhacAMoleWrapper} from "@shared/presentation/whac-a-mole/whac-a-mole.wrapper";
import {WhacAMole} from "@shared/presentation/whac-a-mole/whac-a-mole";

@Injectable({
  providedIn: 'root'
})
export class WhacAMoleProvider<COMPONENT> {
  private pushBoxContainer: WhacAMole | undefined;

  public readonly componentRefMapById = new Map<string, ComponentRef<WhacAMoleWrapper<COMPONENT>>>();
  public readonly componentRefMapByComponentName = new Map<string, ComponentRef<WhacAMoleWrapper<COMPONENT>>[]>();

  private readonly ngxLogger = inject(NGXLogger);

  public async buildItAsync(args: WhacAMoleBuildItArgsType) {
    const componentRef = this.pushBoxContainer?.buildComponentAndRender?.(args);
    return componentRef;
  }

  public updateWhacAMoleComponentAsync(args: WhacAMoleBuildItArgsType) {
    return new Promise<ComponentRef<WhacAMoleWrapper<COMPONENT>>>((resolve, reject) => {
      const componentRef = this.pushBoxContainer?.updatePushBoxComponent?.(args);
      if (!componentRef) {
        reject();
      } else {
        resolve(componentRef);
      }
    });
  }

  public async destroyComponent(component: Type<unknown>) {
    const componentMirror = reflectComponentType(component);

    if (!componentMirror) {
      this.ngxLogger.error('WhacAMole.buildComponentAndRender', 'value of `component` property is not a component');
      return false;
    }

    const { selector } = componentMirror;

    const componentRefList = this.componentRefMapByComponentName.get(selector);

    if (!componentRefList?.length) {
      this.ngxLogger.debug('WhacAMole.destroyComponent Did not find', selector, this);
      return false;
    }

    this.ngxLogger.debug('WhacAMole.destroyComponent', selector);

    componentRefList.forEach((componentRef) => {
      componentRef.instance.destroySelf()();
    });

    this.componentRefMapByComponentName.delete(selector);

    return true;
  }

  public getComponentRef(component: Type<unknown>) {
    const componentMirror = reflectComponentType(component);

    if (!componentMirror) {
      this.ngxLogger.error('WhacAMole.isComponentOpened', 'value of `component` property is not a component');
      return false;
    }

    return this.componentRefMapByComponentName.get(componentMirror.selector)?.find((componentRef) => componentRef.instance.renderedComponent === component);
  }

  public registerContainer(pushBoxContainer: WhacAMole) {
    this.pushBoxContainer = pushBoxContainer;
  }
}
