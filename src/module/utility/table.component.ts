import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	Output
} from "@angular/core";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {DoubleClick} from "@utility/domain/decorator/double-click";
import {ActivatedRoute, Router} from "@angular/router";
import {RIBaseEntity} from "@utility/domain";
import {ITableState} from "@utility/domain/table.state";
import {debounce} from "typescript-debounce-decorator";

@Component({
	selector: 'utility-table-component',
	template: ``
})
export abstract class TableComponent<ITEM extends RIBaseEntity<string>> implements AfterViewInit {

	@Input()
	public goToDetailsOnSingleClick = true;

	@Input({required: true})
	public tableState!: ITableState<ITEM>;

	@Output()
	public readonly singleClickEmitter = new EventEmitter<ITEM>();

	public readonly router = inject(Router);
	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly store = inject(Store);
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly actions!: {
		DeleteItem: any;
		ArchiveItem: any;
		GetList: any;
		UpdateTableState: any;
		ClearTableCacheAndGetList: any;
	};
	public selectedIds: string[] = [];

	public ngAfterViewInit(): void {
		this.initOrderByAndOrderDirHandler();
		this.initUserTapOnTheCardHandler();
	}

	private initUserTapOnTheCardHandler(): void {
		this.singleClickEmitter.subscribe((item) => {
			if (this.goToDetailsOnSingleClick) {
				this.goToDetail(item._id);
			}
		});
	}

	public trackById(index: number, item: ITEM): string {
		return item._id;
	}

	public goToDetail(id: string): void {
		this.router.navigate([id], {
			relativeTo: this.activatedRoute
		}).then();
	}

	@debounce(300)
	public singleClick(item: ITEM) {
		this.singleClickEmitter.emit(item);
	}

	@DoubleClick
	public doubleClick(id: string): void {
		this.goToDetail(id);
	}

	public updateOrderBy(target: HTMLTableCellElement): void {
		const orderBy = target.getAttribute('data-orderBy');
		if (!orderBy) {
			const parent = target.parentElement as HTMLTableCellElement;
			if (parent) {
				this.updateOrderBy(parent);
			}
		} else {
			firstValueFrom(this.store.dispatch(new this.actions.UpdateTableState({
				orderBy
			}))).then(() => {
				this.store.dispatch(new this.actions.GetList());
			});
		}
	}

	public delete(id: string): void {
		this.store.dispatch(new this.actions.DeleteItem({
			id
		}));
		this.clearTableCache();
	}

	public async archive(id: string): Promise<void> {
		await firstValueFrom(this.store.dispatch(
			new this.actions.ArchiveItem({
				id
			})));
		this.clearTableCache();
	}

	public clearTableCache(): void {
		this.store.dispatch(new this.actions.ClearTableCacheAndGetList());
	}

	public pageChange($event: number): void {
		firstValueFrom(this.store.dispatch(new this.actions.UpdateTableState({
			page: $event
		}))).then(() => {
			this.store.dispatch(new this.actions.GetList());
		});
	}

	private initOrderByAndOrderDirHandler(): void {

		// orderBy and orderDir
		this.elementRef.nativeElement.querySelectorAll('[data-orderBy]').forEach((foundElement) => {
			foundElement.classList.add('cursor-pointer');
			foundElement.addEventListener('click', ($event) => {
				if ($event.target) {
					const target = $event.target as HTMLTableCellElement;
					this.updateOrderBy(target);
				}
			})
		});
	}
}
