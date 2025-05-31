import {inject, Injectable} from "@angular/core";
import {OrderDirEnum} from "@core/shared/enum";
import {BehaviorSubject} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import EProduct from "@tenant/product/product/domain/entity/e.product";
import {IProduct} from "@tenant/product/product/domain";

@Injectable()
export class ProductChipPagination {

	private readonly sharedUow = inject(SharedUow);
	private readonly service = this.sharedUow.product;

	private readonly params = {
		page: 1,
		pageSize: 20,
		orderBy: 'createdAt',
		orderDir: OrderDirEnum.ASC,
	};

	public readonly items$ = new BehaviorSubject<IProduct.DTO[]>([]);
	public readonly isLoading$ = new BehaviorSubject<boolean>(false);
	public readonly isLastPage = new BehaviorSubject<boolean>(false);

	public constructor() {
		this.resetParams().fetch().then();
	}

	public resetParams() {
		this.params.page = 1;
		return this;
	}

	public async fetch() {
		this.isLoading$.next(true);
		const {items, totalSize} = await this.service.repository.findAsync(this.params);
		const mappedItems = items.map(EProduct.fromRaw).map(EProduct.toDTO);
		const concatItems = this.items$.value.concat(mappedItems);
		this.items$.next(concatItems);
		this.isLastPage.next(concatItems.length >= totalSize);
		this.nextPage();
		this.isLoading$.next(false);
	}

	public nextPage() {
		this.params.page++;
		return this;
	}

}
