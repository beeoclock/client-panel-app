import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";

import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable()
export class ServiceTableService extends TableService<IService.DTO> {
	public override readonly actions = ServiceActions;
}
