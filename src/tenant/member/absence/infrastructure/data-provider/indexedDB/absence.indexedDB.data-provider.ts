import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	AbsenceDexieAdapterIndexedDBDataProvider
} from "@tenant/member/absence/infrastructure/data-provider/indexedDB/adapter/absence.dexie.adapter.indexedDB.data-provider";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {Types} from "@core/shared/types";
import {DateTime, DateTimeUnit} from "luxon";

@Injectable()
export class AbsenceIndexedDBDataProvider extends IndexedDBDataProvider<EAbsence> {

	protected readonly entityFieldsToSearch = ['note'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(AbsenceDexieAdapterIndexedDBDataProvider);

	public override find$(options: Types.FindQueryParams, filterFunction: ((entity: EAbsence, filter: Types.PartialQueryParams) => boolean) = this.defaultFilter.bind(this)) {
		return super.find$(options, (entity: EAbsence, filter) => {
			const {members, dateRange, ...otherFilter} = filter as Types.PartialQueryParams & {
				dateRange?: {
					interval: DateTimeUnit;
					selectedDate: string;
				};
			};

			let result = filterFunction(entity, otherFilter);

			if (result && members?.length) {

				if (!entity.entireBusiness) {

					result = members.some((memberId) => {
						return entity.members.some(({_id}) => {
							return _id === memberId;
						})
					});

				}

			}

			if (result && dateRange?.selectedDate && dateRange?.interval) {

				const {interval, selectedDate} = dateRange;

				const startDateTime = DateTime.fromISO(selectedDate).startOf(interval).toJSDate().toISOString();
				const endDateTime = DateTime.fromISO(selectedDate).endOf(interval).toJSDate().toISOString();

				const {start, end} = entity;

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
