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
import {
	LightweightOrderServiceCardMolecule
} from "@tenant/order/order-service/presentation/ui/molecule/lightweight-order-service-card/lightweight-order-service-card.molecule";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";

@Component({
	standalone: true,
	selector: 'order-details-order-service-section',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		LightweightOrderServiceCardMolecule
	],
	template: `
		@for (item of (orderId() ? resource.value() : this.serviceList()); track item._id) {
			<lightweight-order-service-card-molecule [item]="item"/>
		}
	`,
	host: {
		class: 'flex flex-col gap-4',
	}
})
export class OrderDetailsOrderServiceSectionComponent {

	public readonly orderId = input<string>();

	public readonly serviceList = input([], {
		transform: (list: IOrderService.DTO[] | IOrderService.EntityRaw[] | EOrderService[]): EOrderService[] => {
			const firstItem = list[0];
			if (firstItem instanceof EOrderService) {
				return list as EOrderService[];
			}
			if (EOrderService.isDTO(firstItem)) {
				return EOrderService.fromDTOList(list);
			}
			return EOrderService.fromRawList(list);
		}
	});

	private readonly page = signal(1);

	public readonly resource: ResourceRef<EOrderService[]> = resource({
		defaultValue: [],
		params: () => ({
			orderId: this.orderId(),
			page: this.page(),
		}),
		loader: async ({params: {orderId, page}}) => {

			const {items} = await this.sharedUow.orderService.repository.findAsync({
				orderId,
				page: 1,
				pageSize: page * 10,
				orderBy: OrderByEnum.CREATED_AT,
				orderDir: OrderDirEnum.DESC,
			});

			const entities = EOrderService.fromRawList(items);

			return entities;

		}
	});

	private readonly sharedUow = inject(SharedUow)

}
