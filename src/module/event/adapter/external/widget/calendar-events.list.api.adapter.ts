import {Injectable} from '@angular/core';
import {ListMergedEventApiAdapter} from "@event/adapter/external/api/list.merged.event.api.adapter";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";

@Injectable({
	providedIn: 'root'
})
export class CalendarEventsListApiAdapter extends ListMergedEventApiAdapter<{
	start: string;
	end: string;
	pageSize: number,
	orderBy: OrderByEnum,
	orderDir: OrderDirEnum,
	status: EventStatusEnum,
}> {

}
