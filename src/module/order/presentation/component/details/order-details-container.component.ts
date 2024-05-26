import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {DeleteButtonComponent} from "@utility/presentation/component/button/delete.button.component";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {NgIf} from "@angular/common";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderActions} from "@order/state/order/order.actions";

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-details-container.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        DynamicDatePipe,
        TranslateModule,
        DeleteButtonComponent,
        EditButtonComponent,
        ActiveStyleDirective,
        NgIf
    ],
    standalone: true
})
export class OrderDetailsContainerComponent {

    // TODO add base index of details with store and delete method

    @Input()
    public item!: IOrderDto;

    public readonly store = inject(Store);

    public async delete(order: IOrderDto) {

        // const {active} = order;
        //
        // if (active) {
        //
        //     return alert('You can\'t delete active order');
        //
        // }

        await firstValueFrom(this.store.dispatch(new OrderActions.DeleteItem(order._id)));

    }

    public openForm() {
        if (!this.item) {
            return
        }
        this.store.dispatch(new OrderActions.OpenFormToEditById(this.item?._id));
    }

}
