import {inject, Injectable} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {IMember} from "@tenant/member/member/domain";

@Injectable()
export class MemberListService {

	private readonly sharedUow = inject(SharedUow);

	public readonly membersMap = toSignal(
		this.sharedUow.member.repository.find$().pipe(
			map(({items}) => items.reduce((map, obj) => {
				map.set(obj._id, obj);
				return map;
			}, new Map<string, IMember.EntityRaw>()))
		)
	);

}
