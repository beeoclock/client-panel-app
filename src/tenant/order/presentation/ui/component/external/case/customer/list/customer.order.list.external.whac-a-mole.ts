import {inject, Injectable} from "@angular/core";
import {WhacAMoleProvider} from "@shared/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";

@Injectable({
    providedIn: 'root'
})
export class CustomerOrderListExternalWhacAMole {

    private readonly ngxLogger = inject(NGXLogger);
    private readonly whacAMaleProvider = inject(WhacAMoleProvider);

    public async execute(customerId: string) {

        this.ngxLogger.info('CustomerOrderListExternalWhacAMole', customerId);

        const {CustomerOrderListExternalComponent} = await import("@tenant/order/presentation/ui/component/external/case/customer/list/customer.order.list.external.component");

        const pushBoxWrapperComponentRef = await this.whacAMaleProvider.buildItAsync({
            component: CustomerOrderListExternalComponent,
            componentInputs: {
                customerId,
            }
        });

        if (!pushBoxWrapperComponentRef) {
            return;
        }

        const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

        if (!renderedComponentRef) {
            return;
        }

        const {instance} = renderedComponentRef;

        if (instance instanceof CustomerOrderListExternalComponent) {

            this.ngxLogger.info('CustomerOrderListExternalWhacAMole', instance);

        }

    }

}
