import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
	TemplateRef,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import EAbsence from "@core/business-logic/absence/entity/e.absence";
import {TableColumn, TableColumnProp} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartComponent
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {DatePipe} from "@angular/common";
import {StateStatusComponent} from "@absence/presentation/component/state-status/state-status.component";
import {RowActionButtonComponent} from "@absence/presentation/component/row-action-button/row-action-button.component";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";

@Component({
	selector: 'app-list-absence-table',
	template: `
		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[filters]="filters()"
			[actionColumn]="{
				name: '',
				cellTemplate: actionCellTemplate,
				sortable: false,
				frozenRight: true,
				minWidth: 56,
				width: 56
			}"
			[columnList]="columnList()"
			[loadData]="this.loadData.bind(this)"/>

		<ng-template #actionCellTemplate let-row="row">
			<app-absence-row-action-button-component
				[item]="row"
				[id]="row._id"/>
		</ng-template>

		<ng-template #stateStatusTemplate let-row="row">
			<state-status-component [item]="row"/>
		</ng-template>


    `,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-65px)] block'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		DatePipe
	],
	imports: [
		TableNgxDatatableSmartComponent,
		StateStatusComponent,
		RowActionButtonComponent,

	]
})
export class TableListComponent extends TableComponent<EAbsence> {

	public readonly stateStatusTemplate = viewChild<TemplateRef<any>>('stateStatusTemplate');

	public readonly columns = signal<TableColumn<EAbsence>[]>([
		{
			name: this.translateService.instant('absence.form.inputs.type.label'),
			prop: 'type',
			minWidth: 140,
			width: 140,
			sortable: false,
		},
		{
			name: this.translateService.instant('absence.form.inputs.type.progressStatus'),
			prop: 'progressStatus',
			minWidth: 140,
			width: 140,
			sortable: false,
			// cellTemplate: stateStatusTemplateRef,
		},
		{
			name: this.translateService.instant('event.keyword.capitalize.start'),
			prop: 'start',
			minWidth: 180,
			width: 180,
			sortable: true,
			isTarget: true,
			$$valueGetter: this.anyDateConvert,
		},
		{
			name: this.translateService.instant('event.keyword.capitalize.end'),
			prop: 'end',
			minWidth: 180,
			width: 180,
			sortable: true,
			$$valueGetter: this.anyDateConvert,
		},
		{
			name: this.translateService.instant('keyword.capitalize.attendees'),
			prop: 'attendees',
			minWidth: 180,
			width: 180,
			sortable: false,
			$$valueGetter: (obj: IAbsence.EntityRaw, prop: TableColumnProp) => {
				if (obj.entireBusiness) {
					return this.translateService.instant('absence.form.inputs.entireBusiness.label');
				} else {
					return obj?.members?.length ?? 0;
				}
			}
		},
		{
			name: this.translateService.instant('keyword.capitalize.note'),
			prop: 'note',
			minWidth: 200,
			width: 200,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.createdAt'),
			prop: 'createdAt',
			minWidth: 240,
			width: 240,
			sortable: true,
			$$valueGetter: this.anyDateConvert,
		},
		{
			name: this.translateService.instant('keyword.capitalize.updatedAt'),
			prop: 'updatedAt',
			minWidth: 240,
			width: 240,
			sortable: true,
			$$valueGetter: this.anyDateConvert,
		},
	]);

	public readonly columnList = computed(() => {
		const columns = this.columns();
		const stateStatusTemplate = this.stateStatusTemplate();
		if (stateStatusTemplate) {
			this.setCellTemplateRef(columns, 'progressStatus', stateStatusTemplate);
		}
		return columns;

	});

	public loadData({page, pageSize, orderBy, orderDir, filters}: AsyncLoadDataFunctionParams) {

		return this.sharedUow.absence.repository.findAsync({
			page,
			pageSize,
			orderDir,
			orderBy,
			...filters,
		});

	}

	public activate($event: ActivateEvent<IAbsence.DTO>) {
		switch ($event.type) {
			case "checkbox":
				break;
			case "click":
				break;
			case "dblclick":
				this.open($event.row);
				break;
			case "keydown":
				break;
			case "mouseenter":
				break;
		}
	}

	@Dispatch()
	public override open(item: IAbsence.DTO) {
		const entity = EAbsence.fromDTO(item);
		return new AbsenceActions.OpenDetails(entity);
	}


}

