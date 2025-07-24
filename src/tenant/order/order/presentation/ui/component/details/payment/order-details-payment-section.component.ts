import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	resource,
	ResourceRef,
	signal,
	ViewEncapsulation
} from "@angular/core";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";
import {
	LightweightPaymentCardMolecule
} from "@tenant/order/payment/presentation/ui/molecule/lightweight-payment-card/lightweight-payment-card.molecule";

@Component({
	standalone: true,
	selector: 'order-details-payment-section',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		LightweightPaymentCardMolecule
	],
	template: `
		@for (payment of resource.value(); track payment._id) {
			<lightweight-payment-card-molecule [item]="payment"/>
		}
	`
})
export class OrderDetailsPaymentSectionComponent {

	public readonly orderId = input.required<string>();
	private readonly page = signal(1);

	public readonly resource: ResourceRef<EPayment[]> = resource({
		defaultValue: [],
		request: () => ({
			orderId: this.orderId(),
			page: this.page(),
		}),
		loader: async ({request: {orderId, page}}) => {

			const {items} = await this.sharedUow.payment.repository.findAsync({
				orderId,
				page: 1,
				pageSize: page * 10,
				orderBy: OrderByEnum.CREATED_AT,
				orderDir: OrderDirEnum.DESC,
			});

			const entities = EPayment.fromRawList(items);

			return entities;

		}
	});

	private readonly sharedUow = inject(SharedUow)

}
