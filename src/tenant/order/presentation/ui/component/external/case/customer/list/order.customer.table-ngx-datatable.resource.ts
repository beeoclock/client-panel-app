import {inject, Injectable} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IOrder} from "@tenant/order/domain/interface/i.order";

@Injectable()
export class OrderCustomerTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IOrder.EntityRaw> {

	private readonly sharedUow = inject(SharedUow);
	protected override readonly loadData = async ({
												page,
												pageSize,
												orderBy,
												orderDir,
												filters
											}: AsyncLoadDataFunctionParams) => {

		const {customerId} = filters;

		if (customerId) {

			const result = await this.sharedUow.order.db.filter((order) => {
				const hasFindCustomer = order.services.some((service) => {
					return service.orderAppointmentDetails.attendees.some((attendee) => {
						return attendee.customer._id === customerId;
					});
				});
				return hasFindCustomer;
			}).toArray();

			return {
				items: result,
				totalSize: result.length,
			};

		}

		return this.sharedUow.order.repository.findAsync({
			page,
			pageSize,
			orderDir,
			orderBy,
			...filters,
		});

	}

}
