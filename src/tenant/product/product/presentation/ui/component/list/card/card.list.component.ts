import {Component, ViewEncapsulation} from '@angular/core';
import {TableComponent} from "@shared/table.component";
import EProduct from "@tenant/product/product/domain/entity/e.product";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import {
	LightweightProductCardMolecule
} from "@tenant/product/product/presentation/ui/molecule/lightweight-product-card/lightweight-product-card.molecule";
import {TranslateModule} from "@ngx-translate/core";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/ui/component/not-found-table-data/not-found-table-data.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/order/payment/presentation/ui/molecule/button/auto-refresh/auto-refresh.button.component";
import {
	CardIonListSmartComponent
} from "@shared/presentation/ui/component/smart/card-ion-list/card-ion-list.smart.component";
import {
	ProductPresentationActions
} from "@tenant/product/product/infrastructure/state/presentation/product.presentation.actions";

@Component({
	selector: 'product-card-list-component',
	template: `
		<card-ion-list-smart-component [itemTemplate]="itemTemplate">

			<ng-template #itemTemplate let-item="item">
				<lightweight-product-card-molecule (click)="open(item)" [item]="item" class="m-2"/>
			</ng-template>

			<not-found-table-data-component
				class="block h-full"
				(clickListener)="openForm()"
				[showLinkToForm]="true"
				[linkLabel]="'product.button.create' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">
				<payment-auto-refresh-component [resetPage]="true" [resetParams]="true"/>
			</not-found-table-data-component>

		</card-ion-list-smart-component>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NotFoundTableDataComponent,
		AutoRefreshButtonComponent,
		CardIonListSmartComponent,
		LightweightProductCardMolecule,
	],
	host: {
		class: 'block flex-1'
	},
})
export class CardListComponent extends TableComponent<EProduct> {

	public readonly showSelectedStatus = new BooleanStreamState(false);

	public override open(item: EProduct): void {
		this.store.dispatch(new ProductPresentationActions.OpenDetails(item));
	}

	public openForm() {
		this.store.dispatch(new ProductPresentationActions.OpenForm());
	}
}
