import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {RIMember} from "../../../../../../core/business-logic/member";
import {MemberActions} from "@member/state/member/member.actions";

@Injectable()
export class MemberTableService extends TableService<RIMember> {
	public override readonly actions = MemberActions;
}
