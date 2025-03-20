import {Component, computed, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@utility/table.component";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {RowActionButtonComponent} from "@member/presentation/component/row-action-button/row-action-button.component";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import {IMember} from "@core/business-logic/member";
import EMember from "@core/business-logic/member/entity/e.member";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	AutoRefreshButtonComponent
} from "@member/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'member-table-list-component',
	template: `
		<app-table-ngx-datatable-smart-component
			(activate)="activate($event)"
			[columnList]="columnList()"
			[actionColumn]="{
				name: '',
				cellTemplate: actionCellTemplate,
				sortable: false,
				frozenRight: true,
				minWidth: 56,
				width: 56
			}">


			<not-found-table-data-component
				class="block h-full"
				(clickListener)="openForm()"
				[showLinkToForm]="true"
				[linkLabel]="'member.button.create' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">
				<member-auto-refresh-component [resetPage]="true" [resetParams]="true"/>
			</not-found-table-data-component>

		</app-table-ngx-datatable-smart-component>
		<ng-template #actionCellTemplate let-row="row">
			<member-row-action-button-component
				[item]="row"
				[id]="row._id"/>
		</ng-template>

		<ng-template #assignmentsServiceCellTemplate let-row="row">

			<div>
				@if (row?.assignments?.service?.full) {


					<div
						class="border bg-green-50 border-green-600 text-green-600 leading-tight px-3 py-1 rounded-full">
						{{ 'keyword.lowercase.all' | translate }}
					</div>

				} @else {


					@if (row?.assignments?.service?.include?.length) {


						<div
							class="border bg-yellow-50 border-yellow-600 text-yellow-600 leading-tight px-3 py-1 rounded-full">
							{{ row.assignments.service.include.length }}
						</div>

					} @else {


						<div
							class="border bg-red-50 border-red-600 text-red-600 leading-tight px-3 py-1 rounded-full">
							{{ 'member.form.assignments.button.hint.includeIsEmpty' | translate }}
						</div>

					}

				}
			</div>
		</ng-template>
		<ng-template #fullNameCellTemplate let-row="row">
			<div class="flex gap-2">

				<div class="rounded-full bg-beeColor-400 min-h-8 min-w-8 flex justify-center items-center">
					@if (row?.avatar?.url) {

						<img [src]="row.avatar.url"
							 class="min-h-8 min-w-8 max-h-8 max-w-8 h-8 w-8 rounded-full object-cover"
							 alt="">

					} @else {


						<div class="text-white text-xs font-bold">{{ row?.firstName?.[0] ?? '' }}</div>

						<div class="text-white text-xs font-bold">{{ row?.lastName?.[0] ?? '' }}</div>

					}
				</div>
				<span class="truncate">
			{{ row.firstName }} {{ row.lastName }}
			</span>
			</div>
		</ng-template>
		<ng-template #profileStatusCellTemplate let-row="row">
			{{ ('member.enum.profileStatus.' + row.profileStatus) | translate }}
		</ng-template>
		<ng-template #emailCellTemplate let-row="row">
			<a [title]="row.email" class="truncate" href="mailto:{{ row.email }}">{{ row.email }}</a>
		</ng-template>
		<ng-template #roleCellTemplate let-row="row">
			{{ 'role.' + row.role | translate }}
		</ng-template>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableNgxDatatableSmartComponent,
		RowActionButtonComponent,
		TranslatePipe,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent
	],
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-65px)] block'
	},
})
export class TableListComponent extends TableComponent<EMember> {

	public readonly assignmentsServiceCellTemplate = viewChild<TemplateRef<any>>('assignmentsServiceCellTemplate');
	public readonly fullNameCellTemplate = viewChild<TemplateRef<any>>('fullNameCellTemplate');
	public readonly profileStatusCellTemplate = viewChild<TemplateRef<any>>('profileStatusCellTemplate');
	public readonly emailCellTemplate = viewChild<TemplateRef<any>>('emailCellTemplate');
	public readonly roleCellTemplate = viewChild<TemplateRef<any>>('roleCellTemplate');
	public readonly columns = signal<TableColumn<EMember>[]>([
		{
			name: this.translateService.instant('keyword.capitalize.fullName'),
			prop: 'fullName',
			minWidth: 200,
			width: 200,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.phone'),
			prop: 'phone',
			minWidth: 160,
			width: 160,
			sortable: true,
		},
		{
			name: this.translateService.instant('keyword.capitalize.email'),
			prop: 'email',
			minWidth: 300,
			width: 300,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.services'),
			prop: 'assignmentsService',
			minWidth: 160,
			width: 160,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.role'),
			prop: 'role',
			minWidth: 160,
			width: 160,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.status'),
			prop: 'active',
			minWidth: 160,
			width: 160,
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
		const assignmentsServiceCellTemplate = this.assignmentsServiceCellTemplate();
		if (assignmentsServiceCellTemplate) {
			this.setCellTemplateRef(columns, 'assignmentsService', assignmentsServiceCellTemplate);
		}
		const fullNameCellTemplate = this.fullNameCellTemplate();
		if (fullNameCellTemplate) {
			this.setCellTemplateRef(columns, 'fullName', fullNameCellTemplate);
		}
		const profileStatusCellTemplate = this.profileStatusCellTemplate();
		if (profileStatusCellTemplate) {
			this.setCellTemplateRef(columns, 'active', profileStatusCellTemplate);
		}
		const emailCellTemplate = this.emailCellTemplate();
		if (emailCellTemplate) {
			this.setCellTemplateRef(columns, 'email', emailCellTemplate);
		}
		const roleCellTemplate = this.roleCellTemplate();
		if (roleCellTemplate) {
			this.setCellTemplateRef(columns, 'role', roleCellTemplate);
		}
		return columns;

	});

	public activate($event: ActivateEvent<IMember.EntityRaw>) {
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

	public override open(item: IMember.EntityRaw) {
		this.store.dispatch(new MemberActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new MemberActions.OpenForm();
	}

}
