import {Component, input} from '@angular/core';
import {DefaultPanelComponent} from "@shared/presentation/component/panel/default.panel.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {SearchInputComponent} from "@shared/presentation/component/input/search.input.component";
import {AutoRefreshComponent} from "@shared/presentation/component/auto-refresh/auto-refresh.component";
import {BaseFilterComponent} from "@shared/base.filter.component";
import {ReactiveFormsModule} from "@angular/forms";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {FilterForm} from "@tenant/product/product-tag/presentation/form";
import {
	ProductTagPresentationActions
} from "@tenant/product/product-tag/infrastructure/state/presentation/product-tag.presentation.actions";
import {ProductTagDataState} from "@tenant/product/product-tag/infrastructure/state/data/product-tag.data.state";

@Component({
	selector: 'product-tag-filter-component',
	standalone: true,
	imports: [
		DefaultPanelComponent,
		NgTemplateOutlet,
		SearchInputComponent,
		AutoRefreshComponent,
		ReactiveFormsModule,
		AsyncPipe,
		PrimaryButtonDirective,
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full p-2">
					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
				</div>

			} @else {

				<div class="flex overflow-x-auto gap-2  p-2">
					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
					<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
				</div>
				<div class="px-2">
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {
			<div class="flex overflow-x-auto gap-2 my-2 px-2">
				<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
			</div>
		}

		<ng-template #SearchInput>
			<utility-search-input-component [formControl]="form.controls.phrase"/>
		</ng-template>

		<ng-template #AutoRefresh>
			<utility-auto-refresh-component id="product-tag-filter-auto-refresh" (emitter)="forceRefresh()"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			@if (showButtonGoToForm()) {
				<button type="button" primary class="!py-3 !px-4 !text-base flex-1"
						(click)="openForm()">
					<i class="bi bi-plus-lg"></i>
					<!--				<span class="hidden xl:block">-->
					<!--					{{ 'product.button.create' | translate }}-->
					<!--				</span>-->
				</button>
			}
		</ng-template>
	`,
})
export class FilterComponent extends BaseFilterComponent {
	public readonly showButtonGoToForm = input(true);

	public override readonly form = new FilterForm();
	public override readonly state = ProductTagDataState;

	public constructor() {
		super();
		super.initHandlers();
	}

	public openForm() {
		this.store.dispatch(new ProductTagPresentationActions.OpenForm());
	}
}
