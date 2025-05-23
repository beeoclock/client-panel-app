import {BaseService} from "@core/shared/service/base.service";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IRole} from "@tenant/member/roles/domain";

type ENTITY_RAW = IRole.EntityRaw;

export class RoleService extends BaseService<ENTITY_RAW> {

	public count() {
		return this.db.where('state').equals(StateEnum.active).count();
	}

}
