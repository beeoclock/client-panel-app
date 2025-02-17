import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	effect,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	input,
	Output,
	Renderer2
} from "@angular/core";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {DoubleClick} from "@utility/domain/decorator/double-click";
import {ActivatedRoute, Router} from "@angular/router";
import {IBaseEntity} from "@utility/domain";
import {ITableState} from "@utility/domain/table.state";
import {debounce} from "typescript-debounce-decorator";
import {OrderByEnum} from "@core/shared/enum";
import {TableService} from "@utility/table.service";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'utility-table-component',
	providers: [TableService],
	template: ``
})
export abstract class TableComponent<ITEM extends IBaseEntity<string>> extends Reactive implements AfterViewInit {

	@Input()
	public goToDetailsOnSingleClick = true;

	public readonly tableState = input.required<ITableState<ITEM>>();

	@Output()
	public readonly singleClickEmitter = new EventEmitter<ITEM>();

	public constructor() {
		super();
		effect(() => {
			this.changeDetectorRef.detectChanges();
		});
	}

	public readonly router = inject(Router);
	public readonly tableService = inject(TableService);
	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly renderer2 = inject(Renderer2);
	public readonly store = inject(Store);
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public selectedIds: string[] = [];

	public ngAfterViewInit(): void {
		this.initOrderByAndOrderDirHandler();
		this.initUserTapOnTheCardHandler();
	}

	private initUserTapOnTheCardHandler(): void {
		this.singleClickEmitter.pipe(this.takeUntil()).subscribe((item) => {
			if (this.goToDetailsOnSingleClick) {
				this.open(item);
			}
		});
	}

	@debounce(300)
	public singleClick(item: ITEM) {
		this.singleClickEmitter.emit(item);
	}

	@DoubleClick
	public doubleClick(item: ITEM): void {
		this.open(item);
	}

	public updateOrderBy(target: HTMLTableCellElement): void {
		const orderBy = target.getAttribute('data-orderBy') as OrderByEnum | null;
		if (!orderBy) {
			const parent = target.parentElement as HTMLTableCellElement;
			if (parent) {
				this.updateOrderBy(parent);
			}
		} else {
			firstValueFrom(this.store.dispatch(new this.tableService.actions.UpdateTableState({
				orderBy
			}))).then(() => {
				this.store.dispatch(new this.tableService.actions.GetList());
			});
		}
	}

	public pageChange($event: number): void {
		this.tableService.pageChange($event);
	}

	public open(item: ITEM): void {
		throw new Error('Method not implemented.');
	}

	private initOrderByAndOrderDirHandler(): void {

		// orderBy and orderDir
		this.elementRef.nativeElement.querySelectorAll('[data-orderBy]').forEach((foundElement) => {
			this.renderer2.addClass(foundElement, 'cursor-pointer');
			this.renderer2.listen(foundElement, 'click', ($event) => {
				if ($event.target) {
					const target = $event.target as HTMLTableCellElement;
					this.updateOrderBy(target);
				}
			})
		});
	}
}
