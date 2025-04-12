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
	Renderer2,
	TemplateRef
} from "@angular/core";
import {Store} from "@ngxs/store";
import {DoubleClick} from "@shared/domain/decorator/double-click";
import {ActivatedRoute, Router} from "@angular/router";
import {ITableState} from "@shared/domain/table.state";
import {debounce} from "typescript-debounce-decorator";
import {Reactive} from "@core/cdk/reactive";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {TableColumn, TableColumnProp} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {DatePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";

@Component({
	selector: 'utility-table-component',
	template: ``,
})
export abstract class TableComponent<ITEM extends ABaseEntity> extends Reactive implements AfterViewInit {

	@Input()
	public goToDetailsOnSingleClick = true;

	public readonly tableState = input<ITableState<ITEM>>();

	@Output()
	public readonly singleClickEmitter = new EventEmitter<ITEM>();

	public constructor() {
		super();
		effect(() => {
			this.changeDetectorRef.detectChanges();
		});
	}


	public readonly sharedUow = inject(SharedUow);
	public readonly datePipe = inject(DatePipe);

	public readonly anyDateConvert = (obj: IBaseEntityRaw<string>, prop: TableColumnProp) => {
		const value = obj[prop as keyof IBaseEntityRaw<string>] as string;
		return this.datePipe.transform(value, 'short');
	};

	public readonly router = inject(Router);
	public readonly translateService = inject(TranslateService);
	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly renderer2 = inject(Renderer2);
	public readonly store = inject(Store);
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public selectedIds: string[] = [];

	public ngAfterViewInit(): void {
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

	public setCellTemplateRef(columns: TableColumn<ITEM>[], prop: TableColumnProp, cellTemplate: TemplateRef<any>) {
		const column = columns.find(column => column.prop === prop);
		if (column) {
			column.cellTemplate = cellTemplate;
		}
	}

	public open(item: ITEM): void {
		throw new Error('Method not implemented.');
	}
}
