import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {TranslateModule} from "@ngx-translate/core";
import {FilterComponent} from "@absence/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {RouterLink} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {
    NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {
    DesktopLayoutListComponent
} from "@order/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {MobileLayoutListComponent} from "@order/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderState} from "@order/state/order/order.state";
import {OrderActions} from "@order/state/order/order.actions";

@Component({
    selector: 'app-list-order-page',
    templateUrl: './list.order.page.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        StarterComponent,
        TranslateModule,
        FilterComponent,
        DropdownComponent,
        RouterLink,
        NgIf,
        AsyncPipe,
        PrimaryButtonDirective,
        NotFoundTableDataComponent,
        DesktopLayoutListComponent,
        MobileLayoutListComponent,
        DesktopLayoutListComponent,
        MobileLayoutListComponent,
        DesktopLayoutListComponent,
        MobileLayoutListComponent,
    ],
    standalone: true
})
export class ListOrderPage extends ListPage {

    public override readonly actions = OrderActions;
    public readonly tableState$: Observable<ITableState<IOrderDto>> = this.store.select(OrderState.tableState)
        .pipe(
            tap((tableState) => {
                this.changeDetectorRef.detectChanges();
            })
        );

}

export default ListOrderPage;