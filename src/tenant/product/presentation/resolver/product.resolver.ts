import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import {IProduct} from "@tenant/product/domain";
import EProduct from "@tenant/product/domain/entity/e.product";

export const productResolver: ResolveFn<EProduct | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const {id} = route.params;

	return sharedUow.product.repository.findById$(id).pipe(
		filter(is.not_null_or_undefined<IProduct.EntityRaw>),
		map((item) => EProduct.fromRaw(item)),
	);

};
