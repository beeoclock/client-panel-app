import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {IMember} from "@core/business-logic/member/interface/i.member";
import {MemberDataActions} from "@tenant/member/infrastructure/state/data/member.data.actions";

@Injectable()
export class MemberTableService extends TableService<IMember.EntityRaw> {
	public override readonly actions = MemberDataActions;
}
