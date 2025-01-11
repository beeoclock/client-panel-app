import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {ServiceActions} from "@service/state/service/service.actions";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {IServiceDto} from "@order/external/interface/i.service.dto";

@Component({
	selector: 'service-detail-page',
	templateUrl: './service-details.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgIf,
		DeleteButtonComponent,
		NgForOf,
		TranslateModule,
		ActiveStyleDirective,
		DynamicDatePipe,
		EditButtonComponent,
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

	public async delete(service: IServiceDto): Promise<void> {
		const {_id: id, active} = service;
		if (active) {
			return alert('You can\'t delete active service');
		}
		await firstValueFrom(this.store.dispatch(new ServiceActions.DeleteItem(id)));
	}

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
