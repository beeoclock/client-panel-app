import {PaymentForm} from "@module/payment/presentation/form/payment.form";
import {FormGroup} from "@angular/forms";
import {OrderForm} from "@order/presentation/form/order.form";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

export interface ICreateOrderForm {

    order: OrderForm;
    payment: PaymentForm;

}

export class CreateOrderForm extends FormGroup<ICreateOrderForm> {

    private readonly destroy$ = new Subject<void>();

    constructor() {

        super({

            order: new OrderForm(),
            payment: new PaymentForm(),

        });

        this.initHandlers();

    }

    public static create(initValue = {}): CreateOrderForm {

        const form = new CreateOrderForm();

        form.patchValue(initValue);

        return form;

    }

    public initHandlers(): void {

        this.initHandlersForAmount();

    }

    public initHandlersForAmount(): void {

        this.controls.order.controls.services.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe((services) => {

            const amount = services.reduce((acc, service) => {
                const price = service.serviceSnapshot?.durationVersions?.[0].prices?.[0]?.price ?? 0;
                return acc + price;
            }, 0);
            this.controls.payment.controls.amount.patchValue(amount);

        });

    }

    public destroyHandlers(): void {

        this.destroy$.next();
        this.destroy$.complete();

    }

}
