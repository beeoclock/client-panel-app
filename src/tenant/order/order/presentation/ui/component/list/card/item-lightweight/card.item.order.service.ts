import {Injectable} from "@angular/core";
import {ICustomer} from "@tenant/customer/domain";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {IOrderServiceDto} from "@tenant/order/order/domain/interface/i.order-service.dto";

interface GroupedServiceBySpecialistAndDate {
	date: string;
	specialist: {
		firstName: string;
		avatar?: string;
	};
	services: IOrderServiceDto[];
}

interface GroupedServiceByCustomer {
	customer: ICustomer.DTO;
	services: IOrderServiceDto[];
}

interface GroupedByCustomerAndThenBySpecialistAndDate {
	customer: ICustomer.DTO;
	services: GroupedServiceBySpecialistAndDate[];
}

const SECONDS_TO_MILLISECONDS = 1_000;

@Injectable()
export class CardItemOrderService {

	public groupByCustomerAndThenBySpecialistAndDate(services: IOrderServiceDto[]): GroupedByCustomerAndThenBySpecialistAndDate[] {
		const groupedByCustomer = this.groupByCustomer(services);

		return groupedByCustomer.map(customerGroup => {
			const groupedBySpecialistAndDate = this.groupBySpecialistAndDate(customerGroup.services);
			return {
				...customerGroup,
				services: groupedBySpecialistAndDate
			};
		});
	}

	public groupByCustomer(services: IOrderServiceDto[]): GroupedServiceByCustomer[] {

		const grouped = services.reduce((acc, service) => {

			if (!service.serviceSnapshot) return acc;

			service.orderAppointmentDetails.attendees.forEach(attendee => {

				const customer = attendee.customer;

				if (!customer) return;

				const key = customer.customerType === CustomerTypeEnum.anonymous ? customer.customerType : customer?._id;

				if (!acc[key]) {
					acc[key] = {
						customer,
						services: []
					};
				}

				acc[key].services.push(service);

			})

			return acc;

		}, {} as Record<string, GroupedServiceByCustomer>);

		return Object.values(grouped).flat();

	}

	/**
	 * Group services by specialist
	 * @param services
	 */
	public groupBySpecialistAndDate(services: IOrderServiceDto[]): GroupedServiceBySpecialistAndDate[] {

		const DIFF_IN_MINUTES = 60;

		const MAX_INTERVAL_BETWEEN_SERVICES = DIFF_IN_MINUTES * SECONDS_TO_MILLISECONDS;

		const grouped = services.reduce((acc, service) => {

			if (!service.serviceSnapshot) return acc;

			const startTime = new Date(service.orderAppointmentDetails.start).getTime();
			const durationMs = this.getDurationInMs(service);
			const endTime = startTime + durationMs;

			const specialist = service.orderAppointmentDetails.specialists[0];

			if (!specialist || !specialist.member._id) return acc;

			const key = specialist.member._id;

			if (!acc[key]) {
				acc[key] = [];
			}

			const lastGroup = acc[key].length > 0 ? acc[key][acc[key].length - 1] : null;

			if (lastGroup) {
				const lastService = lastGroup.services[lastGroup.services.length - 1];
				const {start} = lastService.orderAppointmentDetails;
				const lastServiceDurationMs = this.getDurationInMs(lastService);
				const lastServiceEndTime = new Date(start).getTime() + lastServiceDurationMs;

				if ((startTime - lastServiceEndTime) <= MAX_INTERVAL_BETWEEN_SERVICES) {
					lastGroup.services.push(service);
					return acc;
				}
			}

			acc[key].push({
				date: new Date(service.orderAppointmentDetails.start).toISOString(),
				specialist: {
					firstName: specialist.member.firstName,
					avatar: specialist.member.avatar?.url ?? undefined
				},
				services: [service]
			});

			return acc;

		}, {} as Record<string, GroupedServiceBySpecialistAndDate[]>);

		return Object.values(grouped).flat();
	}

	/**
	 * Get duration in milliseconds
	 * @param service
	 * @private
	 */
	private getDurationInMs(service: IOrderServiceDto): number {
		return (service.serviceSnapshot.durationVersions[0].durationInSeconds || 0) * SECONDS_TO_MILLISECONDS;
	}

}
