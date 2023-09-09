import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {DoubleClick} from "@utility/domain/decorator/double-click";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'utility-table-component',
	template: ``
})
export abstract class TableComponent implements AfterViewInit {

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

	public ngAfterViewInit(): void {
		this.initOrderByAndOrderDirHandler();
	}

	@DoubleClick
	public goToDetail(id: string): void {
		this.router.navigate([id], {
			relativeTo: this.activatedRoute
		});
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
		this.elementRef.nativeElement.querySelectorAll('th[data-orderBy]').forEach((foundElement) => {
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
