import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {ServiceActions} from "@service/state/service/service.actions";
import {NgxMaskPipe} from "ngx-mask";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {LanguagePipe} from "@utility/presentation/pipes/language.pipe";
import {WeekDayPipe} from "@utility/presentation/pipes/week-day.pipe";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
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
		AsyncPipe,
		SpinnerComponent,
		BackLinkComponent,
		BackLinkComponent,
		DeleteButtonComponent,
		RouterLink,
		NgForOf,
		DropdownComponent,
		LanguagePipe,
		WeekDayPipe,
		LoaderComponent,
		TranslateModule,
		NgxMaskPipe,
		EditLinkComponent,
		ActiveStyleDirective,
		CurrencyPipe,
		DynamicDatePipe,
		CardComponent,
		HumanizeDurationPipe,
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
