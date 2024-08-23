import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
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
		CurrencyPipe,
		NgForOf,
		DatePipe
	],
    template: `
		<bee-card padding="p-2" class="text-sm border-2 border-transparent hover:border-blue-500"
				  [class.!border-green-500]="selectedIds.includes(item._id)">
			<div class="flex flex-col gap-2">
				<div class="flex flex-wrap justify-between items-center gap-8">

					<div (click)="singleClick()" class="flex justify-between cursor-pointer">
						<div class="flex-1 flex text-beeColor-500">

							<div class="font-bold">
								{{ ('order.enum.status.singular.' + item.status) | translate }}
							</div>
						</div>
					</div>

					<div class="flex items-center gap-2">
<!--						<div>-->
<!--							<div-->
<!--								class="py-1 px-2 inline-flex items-center gap-x-1 text-xs bg-gray-100 text-gray-800 rounded-lg dark:bg-neutral-500/20 dark:text-neutral-400">-->
<!--								{{ item._id.slice(item._id.length - 6) }}-->
<!--							</div>-->
<!--						</div>-->

						<div
							*ngIf="(baseCurrency$ | async) as baseCurrency"
							class="py-1 px-1.5 inline-flex items-center gap-x-1 bg-gray-100 text-gray-800 rounded-md dark:bg-neutral-500/20 dark:text-neutral-400">
							💰
							{{ amount(item.services) | currency: baseCurrency : 'symbol-narrow' }}
						</div>
						<app-order-row-action-button-component
							*ngIf="showAction"
							[item]="item"
							[id]="item._id"/>
					</div>

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
					<div
						*ngFor="let service of item.services"
						class="flex items-start justify-between bg-white border border-neutral-200 rounded-2xl p-1.5 pe-3">
						<div class="flex flex-col flex-1 items-start" *ngIf="service.orderAppointmentDetails.specialists[0].member as member">
							<div class="flex gap-2 items-center">
								<div
									class="rounded-full bg-beeColor-400 min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 flex justify-center items-center">
									<ng-container *ngIf="member?.avatar?.url; else InitialsTemplate">
										<img [src]="member?.avatar?.url"
											 class="min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 rounded-full object-cover"
											 alt="">
									</ng-container>
									<ng-template #InitialsTemplate>
										<div class="text-white text-xs font-bold">{{ member?.firstName?.[0] ?? '' }}
										</div>
										<div class="text-white text-xs font-bold">{{ member?.lastName?.[0] ?? '' }}
										</div>
									</ng-template>
								</div>
								<div class="whitespace-nowrap text-gray-800 font-bold">
									{{ member.firstName }}
									{{ member.lastName }}
								</div>
							</div>
							<div class="flex items-start gap-2 text-gray-600">
								<div class="mt-1 w-7 flex h-3 items-center justify-start rounded-full" [style.background-color]="service?.serviceSnapshot?.presentation?.color">
									{{ service.serviceSnapshot.presentation.color ? '' : '❓' }}
								</div>
								<div>
									{{ service.serviceSnapshot.languageVersions[0].title }}
								</div>
							</div>
							<div *ngIf="service.orderAppointmentDetails?.attendees?.[0]?.customer as customer" class="flex items-start gap-2 text-gray-600">
								<div class="mt-1 w-7 flex h-3 items-center justify-center">
									👤
								</div>
								<div>
									{{ customer.firstName }}
									{{ customer.lastName }}
								</div>
							</div>
						</div>
						<div class="flex flex-col justify-center items-center">
							<div>
								🗓️ {{ service.orderAppointmentDetails.start | dynamicDate: 'shortDate' }}
							</div>
							<div>
								⏰ {{ service.orderAppointmentDetails.start | date: 'HH:mm' }}
							</div>
						</div>
					</div>
<!--					<div class="flex gap-2">-->
<!--						<div-->
<!--							class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs bg-gray-100 text-gray-800 rounded-md dark:bg-neutral-500/20 dark:text-neutral-400">-->
<!--							{{ item.createdAt | dynamicDate }}-->
<!--						</div>-->
<!--					</div>-->
					<div class="flex justify-between" *ngIf="item.businessNote?.length">
						<div class="flex-1">
							<div>
								{{ 'keyword.capitalize.businessNote' | translate }}
							</div>
							<div class="font-bold">
								{{ item.businessNote | noData }}
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
