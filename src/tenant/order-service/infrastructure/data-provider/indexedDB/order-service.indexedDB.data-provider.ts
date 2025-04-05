import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import EOrderService from "@tenant/order-service/domain/entity/e.order-service";
import {
	OrderServiceDexieAdapterIndexedDBDataProvider
} from "@tenant/order-service/infrastructure/data-provider/indexedDB/adapter/order-service.dexie.adapter.indexedDB.data-provider";
import {Types} from "@core/shared/types";
import {DateTime, DateTimeUnit} from "luxon";

@Injectable()
export class OrderServiceIndexedDBDataProvider extends IndexedDBDataProvider<EOrderService> {

    protected readonly entityFieldsToSearch = [
        'orderId',

        // By services
        'serviceSnapshot.languageVersions.title',
        'serviceSnapshot.languageVersions.description',

        // By specialists
        'orderAppointmentDetails.specialists.member.firstName',
        'orderAppointmentDetails.specialists.member.lastName',
        'orderAppointmentDetails.specialists.member.phone',
        'orderAppointmentDetails.specialists.member.email',

        // By customers
        'orderAppointmentDetails.attendees.customer.firstName',
        'orderAppointmentDetails.attendees.customer.lastName',
        'orderAppointmentDetails.attendees.customer.phone',
        'orderAppointmentDetails.attendees.customer.note',
        'orderAppointmentDetails.attendees.customer.email',
    ];
    protected readonly dexieAdapterIndexedDBDataProvider = inject(OrderServiceDexieAdapterIndexedDBDataProvider);

    public override find$(options: Types.FindQueryParams, filterFunction: ((entity: EOrderService, filter: Types.StandardQueryParams) => boolean) = this.defaultFilter.bind(this)) {
        return super.find$(options, (entity: EOrderService, filter: Types.StandardQueryParams & {
			dateRange?: {
				interval: DateTimeUnit;
				selectedDate: string;
			};
		}) => {
            const {members, services, statuses, dateRange, ...otherFilter} = filter;

            let result = filterFunction(entity, otherFilter);

            if (result && members?.length) {

                result = members.some((memberId) => {
                    return entity.orderAppointmentDetails.specialists.some(({member}) => {
                        return member._id === memberId;
                    })
                });

            }

            if (result && services?.length) {

                result = services.some((serviceId) => {
                    return entity.serviceSnapshot._id === serviceId;
                });

            }

            if (result && statuses?.length) {

                result = statuses.includes(entity.status);

            }

            if (result && dateRange?.selectedDate && dateRange?.interval) {

				const {interval, selectedDate} = dateRange;

				const startDateTime = DateTime.fromISO(selectedDate).startOf(interval).toJSDate().toISOString();
				const endDateTime = DateTime.fromISO(selectedDate).endOf(interval).toJSDate().toISOString();

				const {start, end} = entity.orderAppointmentDetails;

				let localResult = false;

				if (!localResult && end >= startDateTime && end <= endDateTime) {
					localResult = true;
				}

				if (!localResult && start < startDateTime && end > endDateTime) {
					localResult = true;
				}

				if (!localResult && start >= startDateTime && end <= endDateTime) {
					localResult = true;
				}

				result = localResult;

            }

            return result;
        });
    }

}
