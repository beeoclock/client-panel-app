import {Component, inject, input} from '@angular/core';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@customer/presentation/form/filter.form";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {CustomerState} from "@customer/state/customer/customer.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {ReactiveFormsModule} from "@angular/forms";
import ECustomer from "@core/entity/e.customer";
import {map} from "rxjs";
import {clearObjectClone} from "@utility/domain/clear.object";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
	selector: 'customer-filter-component',
	standalone: true,
	imports: [
		SearchInputComponent,
		PrimaryButtonDirective,
		TranslateModule,
		IonSelectActiveComponent,
		DefaultPanelComponent,
		AsyncPipe,
		NgTemplateOutlet,
		AutoRefreshComponent,
		ReactiveFormsModule
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full">
					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
				</div>

			} @else {

				<div class="flex overflow-x-auto gap-2">
					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
					<ng-container *ngTemplateOutlet="CustomerActiveSelect"></ng-container>
					<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
				</div>
				<div>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {
			<div class="flex overflow-x-auto gap-2 my-2 px-2">
				<ng-container *ngTemplateOutlet="CustomerActiveSelect"></ng-container>
				<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
			</div>
		}

		<ng-template #CustomerActiveSelect>
			<ion-select-active
				class="px-4 py-3 border border-beeColor-300 rounded-2xl"
				[control]="form.controls.active"/>
		</ng-template>

		<ng-template #SearchInput>
			<utility-search-input-component [formControl]="form.controls.phrase"/>
		</ng-template>

		<ng-template #AutoRefresh>
			<utility-auto-refresh-component id="customer-filter-auto-refresh" (emitter)="forceRefresh()"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			@if (showButtonGoToForm()) {
				<button type="button" primary class="!py-3 !px-4 !text-base flex-1"
						(click)="openForm()">
					<i class="bi bi-plus-lg"></i>
					<!--				<span class="hidden xl:block">-->
					<!--					{{ 'customer.button.create' | translate }}-->
					<!--				</span>-->
				</button>
			}
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent {

	public readonly showButtonGoToForm = input(true);

	public override readonly form = new FilterForm();
	public override readonly state = CustomerState;
	private readonly customerStore = inject(ECustomer.store);


	public override initHandlers() {

		toObservable(this.customerStore.tableState)
			.pipe(
				this.takeUntil(),
			)
			.subscribe(({filters}: any) => {
				Object.keys(filters).forEach((key) => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					if (!this.form.controls[key]) {
						return;
					}
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					this.form.controls[key].patchValue(filters[key], {
						emitEvent: false,
						onlySelf: true,
					});
				})
			});
		this.form.valueChanges.pipe(
			this.takeUntil(),
			map(clearObjectClone)
		).subscribe(async (value: any) => {
			this.form.disable({
				emitEvent: false,
				onlySelf: true
			});
			// await firstValueFrom(this.store.dispatch(new this.actions.UpdateTableState(value)));
			// await firstValueFrom(this.store.dispatch(new this.actions.GetList()));
			this.form.enable({
				emitEvent: false,
				onlySelf: true
			});
		});

	}

	public override forceRefresh(resetPage = false) {
		this.customerStore.getList({resetPage});
	}

	public openForm() {
		this.customerStore.openForm();
	}
}
