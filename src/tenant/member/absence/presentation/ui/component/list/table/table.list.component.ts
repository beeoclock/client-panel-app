import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
	TemplateRef,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {
	StateStatusComponent
} from "@tenant/member/absence/presentation/ui/component/state-status/state-status.component";
import {
	RowActionButtonComponent
} from "@tenant/member/absence/presentation/ui/component/row-action-button/row-action-button.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/member/absence/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/ui/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";
import {
	AbsencePresentationActions
} from "@tenant/member/absence/infrastructure/state/presentation/absence.presentation.actions";
import {MemberListChipComponent} from "@shared/presentation/ui/component/chip/member/list/member.list.chip";
import {MemberListService} from "@shared/presentation/ui/component/chip/member/list/member.list.service";
import {ActivateEvent, TableColumn, TableColumnProp} from "@swimlane/ngx-datatable";

@Component({
	selector: 'app-list-absence-table',
	template: `
		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[actionColumn]="{
				name: '',
				cellTemplate: actionCellTemplate,
				sortable: false,
				frozenRight: true,
				minWidth: 56,
				width: 56
			}"
			[columnList]="columnList()">

			<not-found-table-data-component
				class="block h-full"
				(clickListener)="openForm()"
				[showLinkToForm]="true"
				[linkLabel]="'absence.button.create' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">
				<app-absence-auto-refresh-component/>
			</not-found-table-data-component>

		</app-table-ngx-datatable-smart-component>

		<ng-template #actionCellTemplate let-row="row">
			<app-absence-row-action-button-component
				[item]="row"
				[id]="row._id"/>
		</ng-template>

		<ng-template #stateStatusTemplate let-row="row">
			<state-status-component [item]="row"/>
		</ng-template>

		<ng-template #membersStatusTemplate let-row="row">
			<div class="flex gap-2 items-center">
				@if (row.entireBusiness) {
					{{ 'absence.form.inputs.entireBusiness.label' | translate }}
				} @else {
					@if (row.members.length) {
						<member-list-chip [showRestMembers]="true" [members]="row.members"/>
					}
				}
			</div>
		</ng-template>
		<ng-template #syncedAtTemplate let-row="row">
			<synchronization-molecule [item]="row"/>
		</ng-template>


	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'h-[calc(100vh-210px)] md:h-[calc(100vh-80px)] block'
	},
	providers: [
		MemberListService
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TableNgxDatatableSmartComponent,
		StateStatusComponent,
		RowActionButtonComponent,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		TranslatePipe,
		MemberListChipComponent,
		SynchronizationMolecule,
	]
})
export class TableListComponent extends TableComponent<EAbsence> {

	public readonly stateStatusTemplate = viewChild<TemplateRef<any>>('stateStatusTemplate');
	public readonly membersStatusTemplate = viewChild<TemplateRef<any>>('membersStatusTemplate');
	public readonly syncedAtTemplate = viewChild<TemplateRef<any>>('syncedAtTemplate');

	public readonly columns = signal<(TableColumn<EAbsence> & {
		$$valueGetter?: any,
		cellTemplate?: TemplateRef<any>,
		isTarget?: boolean
	})[]>([
		{
			name: this.translateService.instant('absence.form.inputs.type.label'),
			prop: 'type',
			minWidth: 140,
			width: 140,
			sortable: false,
			$$valueGetter: (obj: IAbsence.EntityRaw, prop: TableColumnProp) => {
				return this.translateService.instant(`absence.type.${obj.type}.label`);
			},
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
			name: this.translateService.instant('keyword.capitalize.start'),
			prop: 'start',
			minWidth: 180,
			width: 180,
			sortable: true,
			isTarget: true,
			$$valueGetter: this.anyDateConvert,
		},
		{
			name: this.translateService.instant('keyword.capitalize.end'),
			prop: 'end',
			minWidth: 180,
			width: 180,
			sortable: true,
			$$valueGetter: this.anyDateConvert,
		},
		{
			name: this.translateService.instant('keyword.capitalize.members'),
			prop: 'members',
			minWidth: 200,
			width: 200,
			sortable: false,
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
		{
			name: this.translateService.instant('keyword.capitalize.synchronization'),
			prop: 'syncedAt',
			minWidth: 240,
			width: 240,
			sortable: false,
		},
	]);

	public readonly columnList = computed(() => {
		const columns = this.columns();
		const stateStatusTemplate = this.stateStatusTemplate();
		if (stateStatusTemplate) {
			this.setCellTemplateRef(columns, 'progressStatus', stateStatusTemplate);
		}

		const membersStatusTemplate = this.membersStatusTemplate();
		if (membersStatusTemplate) {
			this.setCellTemplateRef(columns, 'members', membersStatusTemplate);
		}

		const syncedAtTemplate = this.syncedAtTemplate();
		if (syncedAtTemplate) {
			this.setCellTemplateRef(columns, 'syncedAt', syncedAtTemplate);
		}

		return columns;

	});

	public activate($event: ActivateEvent<IAbsence.DTO>) {
		switch ($event.type) {
			case "checkbox":
				break;
			case "click":
				this.open($event.row);
				break;
			case "dblclick":
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
		return new AbsencePresentationActions.OpenDetails(entity);
	}

	@Dispatch()
	public openForm() {
		return new AbsencePresentationActions.OpenForm();
	}
}

