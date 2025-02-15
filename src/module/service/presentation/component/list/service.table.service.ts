import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";

import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {IServiceDto} from "../../../../../../core/business-logic/order/interface/i.service.dto";

@Injectable()
export class ServiceTableService extends TableService<IServiceDto> {
	public override readonly actions = ServiceActions;
}
