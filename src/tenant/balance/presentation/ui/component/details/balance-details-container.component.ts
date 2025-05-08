import {Component, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {StandardDetailsEntityComponent} from "@shared/presentation/component/entity/standard-details.entity.component";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {BalanceActionTypeEnum} from "@tenant/balance/domain";
import {CurrencyPipe} from "@angular/common";

@Component({
	selector: 'balance-detail-page',
	templateUrl: './balance-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		StandardDetailsEntityComponent,
		CurrencyPipe,
	],
	host: {
		class: 'bg-neutral-100'
	},
	standalone: true
})
export class BalanceDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<EBalance>();

	protected readonly balanceActionTypeEnum = BalanceActionTypeEnum;
}

export default BalanceDetailsContainerComponent;
