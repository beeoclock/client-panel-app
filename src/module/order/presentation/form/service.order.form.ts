import {BaseEntityForm} from "@utility/base.form";
import {FormArray, FormControl} from "@angular/forms";
import {IMetaDto, IOrderServiceDto, randomMetaDto} from "@order/external/interface/i.order-service.dto";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {IOrderServiceDetailsDto} from "@order/external/interface/i.order-service-details.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";

export interface IServiceOrderForm {

    serviceSnapshot: FormControl<IServiceDto>;
    orderServiceDetails: FormControl<IOrderServiceDetailsDto>;
    customerNote: FormControl<string>;

    status: FormControl<OrderServiceStatusEnum>;
    meta: FormControl<IMetaDto>;

}

export class ServiceOrderForm extends BaseEntityForm<'OrderServiceDto', IServiceOrderForm> {

    constructor() {

        super('OrderServiceDto', {

            serviceSnapshot: new FormControl(),

            orderServiceDetails: new FormControl(),

            status: new FormControl(OrderServiceStatusEnum.pending, {
                nonNullable: true,
            }),

            meta: new FormControl(randomMetaDto(), {
                nonNullable: true,
            }),

            customerNote: new FormControl('', {
                nonNullable: true,
            }),

        });

    }

}

export class ServiceOrderFormArray extends FormArray<ServiceOrderForm> {

    constructor() {
        super([]);
    }

    public pushNewOne(initialValue?: Partial<IOrderServiceDto> | undefined): ServiceOrderForm {

        const control = new ServiceOrderForm();

        if (initialValue) {

            control.patchValue(initialValue);

        }

        this.push(control);
        this.updateValueAndValidity();

        return control;

    }

}
