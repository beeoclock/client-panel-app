import {Component, computed, signal, TemplateRef, viewChild, ViewEncapsulation} from "@angular/core";
import {TableComponent} from "@shared/table.component";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {
	TableNgxDatatableSmartComponent
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.component";
import {
	RowActionButtonComponent
} from "@tenant/member/roles/presentation/component/row-action-button/row-action-button.component";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivateEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {
	AutoRefreshButtonComponent
} from "@tenant/member/roles/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

import ERole from "@tenant/member/roles/domain/entity/e.role";
import {IRole} from "@tenant/member/roles/domain";
import {
	RolePresentationActions
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.actions";

@Component({
	selector: 'role-table-list-component',
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
				[linkLabel]="'role.button.create' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">
				<role-auto-refresh-component/>
			</not-found-table-data-component>

		</app-table-ngx-datatable-smart-component>
		<ng-template #actionCellTemplate let-row="row">
			<role-row-action-button-component
				[item]="row"
				[id]="row._id"/>
		</ng-template>

		<ng-template #nameCellTemplate let-row="row">
			<div class="flex items-center gap-3">
				<div class="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 min-h-10 min-w-10 flex justify-center items-center shadow-sm">
					<div class="text-white text-sm font-bold">{{ row?.name?.[0] ?? 'R' }}</div>
				</div>
				<div class="flex flex-col min-w-0 flex-1">
					<span class="font-medium text-gray-900 truncate">
						{{ row.name }}
					</span>
					@if (row.isOwner) {
						<span class="text-xs text-purple-600 font-medium">
							{{ 'role.owner' | translate }}
						</span>
					}
				</div>
			</div>
		</ng-template>
		<ng-template #isOwnerCellTemplate let-row="row">
			@if (row.isOwner) {
				<div class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-500">
					{{ 'keyword.capitalize.yes' | translate }}
				</div>
			} @else {
				<div class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-500">
					{{ 'keyword.capitalize.no' | translate }}
				</div>
			}
		</ng-template>
		<ng-template #permissionsCellTemplate let-row="row">
			@if (row.permissions?.length) {
				<div class="flex items-center gap-2">
					<div class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
						{{ row.permissions.length }}
					</div>
					@if (row.permissions.length > 0) {
						<div class="text-xs text-gray-500">
							{{ 'role.permissions.count' | translate: { count: row.permissions.length } }}
						</div>
					}
				</div>
			} @else {
				<div class="flex items-center gap-2">
					<div class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-500">
						{{ 'keyword.capitalize.none' | translate }}
					</div>
				</div>
			}
		</ng-template>
		<ng-template #stateCellTemplate let-row="row">
			@switch (row.state) {
				@case ('active') {
					<div class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
						{{ ('keyword.capitalize.active') | translate }}
					</div>
				}
				@case ('inactive') {
					<div class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">
						{{ ('keyword.capitalize.inactive') | translate }}
					</div>
				}
				@case ('archived') {
					<div class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">
						{{ ('keyword.capitalize.archived') | translate }}
					</div>
				}
				@case ('deleted') {
					<div class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-500">
						{{ ('keyword.capitalize.deleted') | translate }}
					</div>
				}
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
	],
	host: {
		class: 'h-[calc(100vh-145px)] md:h-[calc(100vh-80px)] block'
	},
})
export class TableListComponent extends TableComponent<ERole> {

	public readonly nameCellTemplate = viewChild<TemplateRef<any>>('nameCellTemplate');
	public readonly isOwnerCellTemplate = viewChild<TemplateRef<any>>('isOwnerCellTemplate');
	public readonly permissionsCellTemplate = viewChild<TemplateRef<any>>('permissionsCellTemplate');
	public readonly stateCellTemplate = viewChild<TemplateRef<any>>('stateCellTemplate');
	public readonly columns = signal<TableColumn<ERole>[]>([
		{
			name: this.translateService.instant('keyword.capitalize.name'),
			prop: 'name',
			minWidth: 200,
			width: 200,
			sortable: true
		},
		{
			name: this.translateService.instant('keyword.capitalize.isOwner'),
			prop: 'isOwner',
			minWidth: 120,
			width: 120,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.permissions'),
			prop: 'permissions',
			minWidth: 140,
			width: 140,
			sortable: false,
		},
		{
			name: this.translateService.instant('keyword.capitalize.status'),
			prop: 'state',
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
		const nameCellTemplate = this.nameCellTemplate();
		if (nameCellTemplate) {
			this.setCellTemplateRef(columns, 'name', nameCellTemplate);
		}
		const isOwnerCellTemplate = this.isOwnerCellTemplate();
		if (isOwnerCellTemplate) {
			this.setCellTemplateRef(columns, 'isOwner', isOwnerCellTemplate);
		}
		const permissionsCellTemplate = this.permissionsCellTemplate();
		if (permissionsCellTemplate) {
			this.setCellTemplateRef(columns, 'permissions', permissionsCellTemplate);
		}
		const stateCellTemplate = this.stateCellTemplate();
		if (stateCellTemplate) {
			this.setCellTemplateRef(columns, 'state', stateCellTemplate);
		}
		return columns;
	});

	public activate($event: ActivateEvent<IRole.EntityRaw>) {
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

	public override open(item: IRole.EntityRaw) {
		this.store.dispatch(new RolePresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new RolePresentationActions.OpenForm();
	}

}
