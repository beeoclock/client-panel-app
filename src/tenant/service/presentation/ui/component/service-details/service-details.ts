import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {ServiceActions} from "@tenant/service/infrastructure/state/service/service.actions";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";
import {
	RowActionButtonComponent
} from "@tenant/service/presentation/ui/component/row-action-button/row-action-button.component";
import EService from "@tenant/service/domain/entity/e.service";
import {
	StandardDetailsEntityComponent
} from "@shared/presentation/ui/component/entity/standard-details.entity.component";

@Component({
	selector: 'service-detail-page',
	templateUrl: './service-details.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		ActiveStyleDirective,
		RowActionButtonComponent,
		StandardDetailsEntityComponent,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
	standalone: true
})
export class ServiceDetails {

	public readonly item = input.required<EService>();

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

export default ServiceDetails;
