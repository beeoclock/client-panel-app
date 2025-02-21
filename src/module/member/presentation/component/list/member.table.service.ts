import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import {IMember} from "@core/business-logic/member/interface/i.member";

@Injectable()
export class MemberTableService extends TableService<IMember.EntityRaw> {
	public override readonly actions = MemberActions;
}
