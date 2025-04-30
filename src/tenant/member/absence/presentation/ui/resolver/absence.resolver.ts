import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";

export const absenceResolver: ResolveFn<EAbsence | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const absenceId = route.params.id;

	return sharedUow.absence.repository.findById$(absenceId).pipe(
		filter(is.not_null_or_undefined<IAbsence.EntityRaw>),
		map((absence) => EAbsence.fromRaw(absence)),
	);

};
