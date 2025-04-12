import {Component, computed, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {
	RowActionButtonComponent
} from "@tenant/member/member/presentation/component/row-action-button/row-action-button.component";
import {IMember} from "@tenant/member/member/domain";
import EMember from "@tenant/member/member/domain/entity/e.member";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	AutoRefreshButtonComponent
} from "@tenant/member/member/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	MemberPresentationActions
} from "@tenant/member/member/infrastructure/state/presentation/member.presentation.actions";
import {NoAvailable} from "@shared/presentation/component/no-available/no-available";

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
				<member-auto-refresh-component/>
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
		<ng-template #roleCellTemplate let-row="row">
			{{ 'role.' + row.role | translate }}
		</ng-template>
		<ng-template #emailCellTemplate let-row="row">
			@if (row.email?.length) {
				<a [href]="'mailto:' + row.email" (click)="$event.stopPropagation();" class="truncate inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-sm font-medium transition-all bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-white/10 dark:text-white">
					{{ row.email }}
					<i class="text-neutral-400 bi bi-envelope-plus"></i>
				</a>
			} @else {
				<no-available/>
			}
		</ng-template>
		<ng-template #phoneCellTemplate let-row="row">
			@if (row.phone?.length) {
				<a [href]="'tel:' + row.phone" (click)="$event.stopPropagation();" class="truncate inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-sm font-medium transition-all bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-white/10 dark:text-white">
					{{ row.phone }}
					<i class="text-neutral-400 bi bi-telephone-outbound"></i>
				</a>
			} @else {
				<no-available/>
			}
		</ng-template>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableNgxDatatableSmartComponent,
		RowActionButtonComponent,
		TranslatePipe,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		NoAvailable
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
	public readonly phoneCellTemplate = viewChild<TemplateRef<any>>('phoneCellTemplate');
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

		const phoneCellTemplate = this.phoneCellTemplate();
		if (phoneCellTemplate) {
			this.setCellTemplateRef(columns, 'phone', phoneCellTemplate);
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

	public override open(item: IMember.EntityRaw) {
		this.store.dispatch(new MemberPresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new MemberPresentationActions.OpenForm();
	}

}
