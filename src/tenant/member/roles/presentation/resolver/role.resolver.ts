import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import ERole from "@tenant/member/roles/domain/entity/e.role";
import {IRole} from "@tenant/member/roles/domain";

export const roleResolver: ResolveFn<ERole | undefined> = (route: ActivatedRouteSnapshot) => {

	const sharedUow = inject(SharedUow);
	const {id} = route.params;

	return sharedUow.role.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IRole.EntityRaw>),
		map((item) => ERole.fromRaw(item)),
	);
};
