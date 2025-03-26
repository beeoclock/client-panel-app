import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {EventRequestedActions} from "@[tenant]/event/presentation/state/event-requested/event-requested.actions";
import {RMIEvent} from "@[tenant]/event/domain";

@Injectable()
export class RequestedEventTableService extends TableService<RMIEvent> {
	public override readonly actions = EventRequestedActions;
}
