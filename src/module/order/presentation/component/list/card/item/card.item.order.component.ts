import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, CurrencyPipe, NgIf} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RowActionButtonComponent} from "@order/presentation/component/row-action-button/row-action-button.component";
import {TranslateModule} from "@ngx-translate/core";
import {debounce} from "typescript-debounce-decorator";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderActions} from "@order/state/order/order.actions";
import {Store} from "@ngxs/store";
import {IOrderServiceDto} from "@src/module/order/external/interface/i.order-service.dto";
import {ClientState} from "@client/state/client/client.state";
import {RIClient} from "@client/domain";
import {filter, map} from "rxjs";
import {is} from "thiis";

@Component({
    selector: 'app-card-item-order-component',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        AsyncPipe,
        CardComponent,
        DynamicDatePipe,
        NgIf,
        NoDataPipe,
        RowActionButtonComponent,
        TranslateModule,
        CurrencyPipe
    ],
    template: `
        <bee-card class="text-sm border-2 border-transparent hover:border-blue-500"
                  [class.!border-green-500]="selectedIds.includes(item._id)">
            <div>
                <div class="flex flex-wrap justify-between items-center gap-8">

                    <div (click)="singleClick()" class="flex justify-between cursor-pointer">
                        <div class="flex-1 flex text-beeColor-500">
                            <div>
                                #
                            </div>
                            <div class="flex gap-2">
                                <div>{{ item._id }}</div>
                            </div>
                        </div>
                    </div>
                    <app-order-row-action-button-component
                            *ngIf="showAction"
                            [item]="item"
                            [id]="item._id"/>

                    <div (click)="singleClick()" class=" cursor-pointer" *ngIf="showSelectedStatus">
                        <div
                                *ngIf="selectedIds.includes(item._id)"
                                class="w-full border border-green-200 bg-green-50 text-green-600 px-2 py-1 rounded-2xl">
                            {{ 'keyword.capitalize.selected' | translate }}
                        </div>
                        <div
                                *ngIf="!selectedIds.includes(item._id)"
                                class="w-full border border-blue-200 bg-blue-50 text-blue-600 px-2 py-1 rounded-2xl">
                            {{ 'keyword.capitalize.select' | translate }}
                        </div>
                    </div>
                </div>
                <div (click)="singleClick()" class="flex flex-col gap-2 cursor-pointer">
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex justify-between">
                            <div class="flex-1">
                                <div>
                                    {{ 'keyword.capitalize.services' | translate }}
                                </div>
                                <div class="font-bold">
                                    {{ item.services.length }}
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <div class="flex-1">
                                <div>
                                    {{ 'keyword.capitalize.status' | translate }}
                                </div>
                                <div class="font-bold">
                                    {{ ('order.enum.status.singular.' + item.status) | translate }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="flex-1">
                            <div>
                                {{ 'keyword.capitalize.businessNote' | translate }}
                            </div>
                            <div class="font-bold">
                                {{ item.businessNote | noData }}
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex justify-between">
                            <div class="flex-1">
                                <div>
                                    {{ 'keyword.capitalize.amount' | translate }}
                                </div>
                                <div class="font-bold" *ngIf="(baseCurrency$ | async) as baseCurrency">
                                    {{ amount(item.services) | currency: baseCurrency : 'symbol-narrow' }}
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <div class="flex-1">
                                <div>
                                    {{ 'keyword.capitalize.createdAt' | translate }}
                                </div>
                                <div class="font-bold">
                                    {{ item.createdAt | dynamicDate }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </bee-card>`
})
export class CardItemOrderComponent {

    @Input({required: true})
    public selectedIds!: string[];

    @Input({required: true})
    public item!: IOrderDto;

    @Input({required: true})
    showAction: boolean = true;

    @Input({required: true})
    showSelectedStatus: boolean = false;

    @HostBinding()
    public class = 'min-w-[340px] w-[340px]'

    private readonly store = inject(Store);

    public readonly baseCurrency$ = this.store.select(ClientState.item).pipe(
        filter(is.object_not_empty<RIClient>),
        map((client) => {
            return client.businessSettings.baseCurrency;
        })
    )

    @debounce(300)
    public singleClick() {
        this.open();
    }

    public open() {
        this.store.dispatch(new OrderActions.OpenDetails(this.item));
    }

    public amount(services: IOrderServiceDto[]): number {

        return services.reduce((acc, service) => {
            return acc + (service.serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.price ?? 0);
        }, 0);

    }

}
