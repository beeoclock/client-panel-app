import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import EMember from "@tenant/member/domain/entity/e.member";
import {IMember} from "@tenant/member/domain";

export const memberResolver: ResolveFn<EMember | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const {id} = route.params;

	return sharedUow.member.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IMember.EntityRaw>),
		map((item) => EMember.fromRaw(item)),
	);

};
