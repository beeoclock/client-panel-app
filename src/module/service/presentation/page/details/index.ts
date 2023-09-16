import {ChangeDetectionStrategy, Component, HostBinding, inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {firstValueFrom, Observable} from 'rxjs';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {IService} from '@service/domain';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {Select, Store} from "@ngxs/store";
import {ServiceState} from "@service/state/service/service.state";
import {ServiceActions} from "@service/state/service/service.actions";
import {NgxMaskPipe} from "ngx-mask";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date.pipe";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {LanguagePipe} from "@utility/presentation/pipes/language.pipe";
import {WeekDayPipe} from "@utility/presentation/pipes/week-day.pipe";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {BocMediaDirective} from "@module/media/presentation/directive/boc-media/boc-media.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";

@Component({
	selector: 'service-detail-page',
	templateUrl: './index.html',
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
		BocMediaDirective,
		HumanizeDurationPipe,
	],
	standalone: true
})
export default class Index {

	@Select(ServiceState.itemData)
	public readonly item$!: Observable<IService>;

	@HostBinding()
	public readonly class = 'p-4 block';

	public readonly store = inject(Store);

	@ViewChild(BackLinkComponent)
	public backLink!: BackLinkComponent;

	public async delete(service: IService): Promise<void> {
		const {_id: id, active} = service;
		if (active) {
			return alert('You can\'t delete active service');
		}
		await firstValueFrom(this.store.dispatch(new ServiceActions.DeleteItem(id)));
		this.backLink.link.nativeElement.click();
	}


}
