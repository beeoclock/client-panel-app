import {Injectable} from "@angular/core";
import {Table} from "dexie";
import {firstValueFrom, Observable} from "rxjs";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";

type ENTITY = IOrder.Entity;

@Injectable()
export class OrderService {

	#db: Table<ENTITY> | null = null;

	public constructor(
		public readonly repository: BaseRepository<ENTITY>,
	) {
		this.initDB().then();
	}

	public get db(): Table<ENTITY> {
		if (!this.#db) {
			throw new Error('Table not initialized');
		}
		return this.#db;
	}

	public async initDB(): Promise<void> {

		if ('db$' in this.repository.dataProvider) {

			const {db$} = this.repository.dataProvider as { db$: Observable<Table<ENTITY>> };
			this.#db = await firstValueFrom(db$);

		}

	}

	/**
	 * Find all absences by range
	 * @param start
	 * @param end
	 * @param statuses
	 */
	public async findByServicesRangeAndStatuses(start: string, end: string, statuses: OrderServiceStatusEnum[]) {
		return this.db.filter(({services}) =>
			services.some((service) =>
				(
					statuses.includes(service.status)
				) && (
					(service.orderAppointmentDetails.start >= start && service.orderAppointmentDetails.start < end) ||
					(service.orderAppointmentDetails.end > start && service.orderAppointmentDetails.end <= end) ||
					(service.orderAppointmentDetails.start < start && service.orderAppointmentDetails.end > end)
				)
			)
		).toArray();
	}

}
