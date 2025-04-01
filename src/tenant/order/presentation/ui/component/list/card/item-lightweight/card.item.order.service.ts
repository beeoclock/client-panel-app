import {Injectable} from "@angular/core";
import {IOrderServiceDto} from "@tenant/order/domain/interface/i.order-service.dto";

interface GroupedService {
	date: string;
	specialist: {
		firstName: string;
		avatar?: string;
	};
	services: IOrderServiceDto[];
}

const SECONDS_TO_MILLISECONDS = 1000;

@Injectable()
export class CardItemOrderService {

	/**
	 * Group services by specialist
	 * @param services
	 */
	public groupBySpecialist(services: IOrderServiceDto[]): GroupedService[] {

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

		}, {} as Record<string, GroupedService[]>);

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
