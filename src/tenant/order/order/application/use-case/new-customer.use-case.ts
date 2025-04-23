import {SharedUow} from "@core/shared/uow/shared.uow";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import ECustomer from "@tenant/customer/domain/entity/e.customer";

export class NewCustomerUseCase {

	public constructor(
		private readonly sharedUow: SharedUow,
		private readonly orderEntity: EOrder,
	) {
	}

	public async execute() {

		// Resolve new customer case
		for (const service of this.orderEntity.services) {

			for (const attendee of service.orderAppointmentDetails.attendees) {

				if (attendee.customer.customerType === CustomerTypeEnum.new) {

					const customerFound = await this.sharedUow.customer.findOneByEmailPhone({
						email: attendee.customer.email,
						phone: attendee.customer.phone,
					})

					if (customerFound) {

						attendee.customer = ECustomer.fromRaw(customerFound).toDTO();

					} else {

						const customerEntity = ECustomer.fromDTO({
							...attendee.customer,
							customerType: CustomerTypeEnum.regular,
						});

						await this.sharedUow.customer.repository.createAsync(customerEntity);
						attendee.customer = customerEntity.toDTO();

					}

				}

			}

		}

	}

}
