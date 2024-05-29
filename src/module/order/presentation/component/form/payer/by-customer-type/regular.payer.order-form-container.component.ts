import {Component, HostBinding, inject, Input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {PaymentForm} from "@module/payment/presentation/form/payment.form";
import {NgIf} from "@angular/common";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {Reactive} from "@utility/cdk/reactive";

@Component({
    selector: 'app-regular-payer-order-form-container',
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgIf,
        TranslateModule,
        PrimaryLinkButtonDirective
    ],
    standalone: true,
    template: `

        <ng-container *ngIf="getCustomer() as customer">
            <div class="rounded-lg border border-gray-200 grid grid-cols-1 py-2 px-3 text-sm leading-6">
                <div>{{ customer.firstName }} {{ customer.lastName }} </div>
                <div>{{ customer.email }}</div>
                <div>{{ customer.phone }}</div>
            </div>
        </ng-container>

        <button type="button" primaryLink (click)="selectCustomer()">
            <i class="bi bi-list-check"></i>
            {{ 'event.form.section.attendant.button.select' | translate }}
        </button>

    `
})
export class RegularPayerOrderFormContainerComponent extends Reactive {

    @Input()
    public form!: PaymentForm;

    @HostBinding()
    public readonly class = 'flex flex-col gap-2'

    private readonly pushBoxService = inject(PushBoxService);

    public getCustomer() {
        if (!this.form.controls.payer.value) {
            return null;
        }
        if (!this.form.controls.payer.value.firstName) {
            return null;
        }
        return this.form.controls.payer.value;
    }

    public async selectCustomer() {
        const {SelectCustomerPushBoxComponent} = await import("@customer/presentation/push-box/select-customer.push-box.component");

        const pushBoxWrapperComponentRef = await this.pushBoxService.buildItAsync({
            component: SelectCustomerPushBoxComponent,
        });

        if (!pushBoxWrapperComponentRef) {
            return;
        }

        const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

        if (renderedComponentRef?.instance instanceof SelectCustomerPushBoxComponent) {
            renderedComponentRef.instance.selectedCustomerListener.pipe(this.takeUntil()).subscribe(() => {

                const {newSelectedServiceList} = renderedComponentRef.instance;

                this.form.controls.payer.patchValue(newSelectedServiceList[0]);

                this.pushBoxService.destroy$.next(SelectCustomerPushBoxComponent.name);
            });
        }

    }

}
