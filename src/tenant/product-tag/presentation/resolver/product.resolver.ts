import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import EProductTag from "@tenant/product-tag/domain/entity/e.product-tag";
import {IProductTag} from "@tenant/product-tag/domain";

export const productTagResolver: ResolveFn<EProductTag | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const {id} = route.params;

	return sharedUow.productTag.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IProductTag.EntityRaw>),
		map((item) => EProductTag.fromRaw(item)),
	);

};
