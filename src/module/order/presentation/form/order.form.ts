import {BaseEntityForm} from "@utility/base.form";
import {FormControl} from "@angular/forms";
import {IOrderProductDto} from "@order/external/interface/i.order-product.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {OrderStatus} from "@order/domain/enum/order.status.enum";
import {IOrderMetaDto, randomOrderMetaDto} from "@order/external/interface/i.order-meta.dto";

export interface IOrderForm {

    products: FormControl<IOrderProductDto[]>;
    services: FormControl<IOrderServiceDto[]>;
    status: FormControl<OrderStatus>;
    meta: FormControl<IOrderMetaDto>;
    businessNote: FormControl<string>;

}

export class OrderForm extends BaseEntityForm<'OrderDto', IOrderForm> {

    constructor() {

        super('OrderDto', {

            products: new FormControl<IOrderProductDto[]>([], {
                nonNullable: true,
            }),

            services: new FormControl<IOrderServiceDto[]>([], {
                nonNullable: true,
            }),

            status: new FormControl<OrderStatus>(OrderStatus.CONFIRMED, {
                nonNullable: true,
            }),

            meta: new FormControl(randomOrderMetaDto(), {
                nonNullable: true,
            }),

            businessNote: new FormControl('', {
                nonNullable: true,
            }),

        });

    }

}


