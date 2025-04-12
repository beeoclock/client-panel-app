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
import {TableColumn, TableColumnProp} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {
	StateStatusComponent
} from "@tenant/member/absence/presentation/ui/component/state-status/state-status.component";
import {
	RowActionButtonComponent
} from "@tenant/member/absence/presentation/ui/component/row-action-button/row-action-button.component";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	AutoRefreshButtonComponent
} from "@tenant/member/absence/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";
import {
	AbsencePresentationActions
} from "@tenant/member/absence/infrastructure/state/presentation/absence.presentation.actions";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {IMember} from "@tenant/member/member/domain";
import {
	MemberPresentationActions
} from "@tenant/member/member/infrastructure/state/presentation/member.presentation.actions";

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

						@let data = membersMap()?.get(row.members[0]._id);
						@if (data) {
							<button (click)="openMemberDetails($event, data)" class="inline-flex flex-nowrap items-center bg-white border border-neutral-200 hover:bg-neutral-200 transition-all rounded-full p-1 pe-3 dark:bg-neutral-900 dark:border-neutral-700">
								<img class="me-1.5 inline-block size-8 rounded-full object-cover" [src]="data.avatar.url" alt="Avatar">
								<div class="whitespace-nowrap font-medium text-neutral-800 dark:text-white flex flex-col">
									<span>{{ data.firstName }}</span>
								</div>
							</button>
						}
						@let restMembersLength = row.members.length - 1;
						@if (restMembersLength) {
							<div class="bg-white rounded-full w-[42px] h-[42px] border flex items-center justify-center">
								+{{ restMembersLength }}
							</div>
						}
					}
				}
			</div>
		</ng-template>


	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-65px)] block'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TableNgxDatatableSmartComponent,
		StateStatusComponent,
		RowActionButtonComponent,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		TranslatePipe,
	]
})
export class TableListComponent extends TableComponent<EAbsence> {

	public readonly membersMap = toSignal(
		this.sharedUow.member.repository.find$().pipe(
			map(({items}) => items.reduce((map, obj) => {
				map.set(obj._id, obj);
				return map;
			}, new Map<string, IMember.EntityRaw>()))
		)
	);

	public readonly stateStatusTemplate = viewChild<TemplateRef<any>>('stateStatusTemplate');
	public readonly membersStatusTemplate = viewChild<TemplateRef<any>>('membersStatusTemplate');

	public readonly columns = signal<TableColumn<EAbsence>[]>([
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

	public openMemberDetails($event: MouseEvent, data: IMember.EntityRaw) {
		$event.stopPropagation();
		this.dispatchMemberDetails(data);
	}

	@Dispatch()
	public dispatchMemberDetails(data: IMember.EntityRaw) {
		return new MemberPresentationActions.OpenDetails(data);
	}
}

