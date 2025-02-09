import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {ServiceActions} from "@service/state/service/service.actions";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {RowActionButtonComponent} from "@service/presentation/component/row-action-button/row-action-button.component";
import {StateEnum} from "@utility/domain/enum/state.enum";

@Component({
	selector: 'service-detail-page',
	templateUrl: './service-details.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		ActiveStyleDirective,
		DynamicDatePipe,
		RowActionButtonComponent,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
	standalone: true
})
export class ServiceDetails {

	public readonly item = input<IServiceDto | null>(null);

	public readonly store = inject(Store);
	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public edit(): void {
		const item = this.item();
		if (!item) return;
		this.store.dispatch(new ServiceActions.OpenForm({
			componentInputs: {
				isEditMode: true,
				item: item
			}
		}));
	}


}
