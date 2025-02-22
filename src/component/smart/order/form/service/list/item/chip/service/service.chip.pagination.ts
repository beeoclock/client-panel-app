import {inject, Injectable} from "@angular/core";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {BehaviorSubject} from "rxjs";
import {IService} from "@core/business-logic/service/interface/i.service";
import EService from "@core/business-logic/service/entity/e.service";
import {SharedUow} from "@core/shared/uow/shared.uow";

@Injectable()
export class ServiceChipPagination {

	private readonly sharedUow = inject(SharedUow);
	private readonly service = this.sharedUow.service;

	private readonly params = {
		page: 1,
		pageSize: 10,
		orderBy: OrderByEnum.UPDATED_AT,
		orderDir: OrderDirEnum.DESC,
	};

	public readonly items$ = new BehaviorSubject<IService.DTO[]>([]);
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
		const mappedItems = items.map(EService.fromRaw).map(EService.toDTO);
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
