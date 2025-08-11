import { DataProvider } from '@core/system/infrastructure/data-provider/data-provider';
import { inject, Injectable } from '@angular/core';
import { Types } from '@core/shared/types';
import { IOrderService } from '@tenant/order/order-service/domain/interface/i.order-service.dto';
import { from, map, of } from 'rxjs';
import EOrderService from '@tenant/order/order-service/domain/entity/e.order-service';
import { SharedUow } from '@core/shared/uow/shared.uow';

@Injectable()
export class ApiDataProvider extends DataProvider<IOrderService.DTO> {
	// private readonly getApi = inject(GetApi);
	// private readonly getItemApi = inject(GetItemApi);
	// private readonly putApi = inject(PutApi);
	private readonly sharedUow = inject(SharedUow);

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		// return this.getApi.execute$(options).pipe(
		// 	map(({items, totalSize}) => ({
		// 		items: items.map(({services}) => services.map(EOrderService.fromDTO)).flat(),
		// 		totalSize,
		// 	})),
		// );
		return this.sharedUow.order.repository.find$(options).pipe(
			map(({ items, totalSize }) => ({
				items: items
					.map(({ services }) => services.map(EOrderService.fromDTO))
					.flat(),
				totalSize,
			}))
		);
	}

	public override findById$(id: string) {
		return from(this.sharedUow.order.findByServiceIds([id])).pipe(
			map((items) => {
				const item = items[0];
				if (!item) {
					return undefined;
				}
				const found = item.services.find(
					(service) => service._id === id
				);
				if (!found) {
					return undefined;
				}
				return EOrderService.fromDTO(found);
			})
		);
	}

	public override create$(data: IOrderService.DTO) {
		return of(data);
	}

	/**
	 * TODO
	 * @param dto
	 */
	public override update$(dto: IOrderService.DTO) {
		return of(dto);
	}
}
