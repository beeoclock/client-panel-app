import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {IService} from "@service/domain";
import {ServiceActions} from "@service/state/service/service.actions";

@Injectable()
export class ServiceTableService extends TableService<IService> {
	public override readonly actions = ServiceActions;
}
