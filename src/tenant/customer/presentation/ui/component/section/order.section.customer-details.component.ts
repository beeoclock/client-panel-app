import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	signal,
	ViewEncapsulation
} from "@angular/core";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LoaderComponent} from "@shared/presentation/ui/component/loader/loader.component";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {
	CardItemLightweightOrderComponent
} from "@tenant/order/order/presentation/ui/component/list/card/item-lightweight/card.item.order.component";
import {
	CardItemOrderService
} from "@tenant/order/order/presentation/ui/component/list/card/item-lightweight/card.item.order.service";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	selector: 'order-section-customer-details',
	imports: [
		IonLabel,
		IonSegment,
		IonSegmentButton,
		ReactiveFormsModule,
		LoaderComponent,
		CardItemLightweightOrderComponent,
		TranslatePipe,
	],
	providers: [
		CardItemOrderService,
	],
	template: `

		<div class="p-2 bg-white">
			<ion-segment [formControl]="modeControl">
				<ion-segment-button value="actualOrFuture">
					<ion-label>
						{{ 'keyword.capitalize.upcoming' | translate }}
					</ion-label>
				</ion-segment-button>
				<ion-segment-button value="history">
					<ion-label>
						{{ 'keyword.capitalize.past' | translate }}
					</ion-label>
				</ion-segment-button>
			</ion-segment>
		</div>
		<div class="p-2 flex flex-col gap-2">
			@for (item of list(); track item._id) {
				<app-card-item-lightweight-order-component class="w-full" [orderDto]="item"/>
			}
			@if (loading()) {
				<utility-loader/>
			} @else {
				@if (isReachedEnd()) {
					<div class="text-center w-full text-gray-500 p-2">
						{{ 'pagination.message.allDataDownloaded' | translate }}
					</div>
				} @else {
					<button class="bg-blue-500 cursor-pointer hover:bg-blue-600 transition-all p-2 rounded-2xl text-white" (click)="nextPage()">
						{{ 'keyword.capitalize.loadMore' | translate }}
					</button>
				}
			}
		</div>
	`,
	host: {
		class: 'flex flex-col gap-2',
	}
})
export class OrderSectionCustomerDetailsComponent {

	public readonly customer = input.required<ECustomer>();
	private readonly sharedUow = inject(SharedUow);
	public readonly modeControl = new FormControl<'actualOrFuture' | 'history'>('actualOrFuture', {
		nonNullable: true,
	});
	private readonly modeControlSubscription = this.modeControl.valueChanges.pipe(
		takeUntilDestroyed()
	).subscribe(() => {
		this.list.set([]);
		this.pagination.update(p => ({...p, page: 1}));
		this.initializeOrderList().then();
	})
	public readonly pagination = signal({
		page: 1,
		pageSize: 10
	})
	public readonly isReachedEnd = signal(false);
	public readonly loading = signal(false);
	public readonly list = signal<IOrder.EntityRaw[]>([]);

	public constructor() {
		afterNextRender(() => {
			this.initializeOrderList().then();
		});
	}

	public nextPage() {
		this.pagination.update(p => ({...p, page: p.page + 1}));
		this.initializeOrderList().then();
	}

	public async initializeOrderList() {
		this.loading.set(true);
		const customer = this.customer();
		const pagination = this.pagination();
		const mode = this.modeControl.value;
		const action = {
			actualOrFuture: () => this.sharedUow.order.findActualOrFutureByCustomerId(customer._id, pagination),
			history: () => this.sharedUow.order.findHistoryByCustomerId(customer._id, pagination),
		}[mode];
		const result = await action();
		this.list.update((list) => {
			this.isReachedEnd.set(result.items.length < pagination.pageSize);
			if (pagination.page === 1) {
				return result.items;
			} else {
				return list.concat(result.items);
			}
		})
		this.loading.set(false);
	}


}
