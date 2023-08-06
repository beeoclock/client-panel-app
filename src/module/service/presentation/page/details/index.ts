import {ChangeDetectionStrategy, Component, HostBinding, inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {firstValueFrom, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {IService} from '@service/domain';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LanguagePipe} from "@utility/pipes/language.pipe";
import {WeekDayPipe} from "@utility/pipes/week-day.pipe";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Select, Store} from "@ngxs/store";
import {ServiceState} from "@service/state/service/service.state";
import {ServiceActions} from "@service/state/service/service.actions";
import {NgxMaskPipe} from "ngx-mask";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {ActiveStyleDirective} from "@utility/directives/active-style/active-style.directive";
import humanizeDuration from "humanize-duration";
import {Duration} from "luxon";
import {DynamicDatePipe} from "@utility/pipes/dynamic-date.pipe";

@Component({
  selector: 'service-detail-page',
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    NgIf,
    AsyncPipe,
    SpinnerComponent,
    BackLinkComponent,
    BodyCardComponent,
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
  ],
  standalone: true
})
export default class Index {

  @Select(ServiceState.itemData)
  public readonly item$!: Observable<IService>;

  @HostBinding()
  public readonly class = 'p-4 block';

  public readonly store = inject(Store);
  public readonly translateService = inject(TranslateService);

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

  public formatDuration(duration: string): string {

    return humanizeDuration(Duration.fromISOTime(duration).as('milliseconds'), {language: this.translateService.currentLang});

  }


}
