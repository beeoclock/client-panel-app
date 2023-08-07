import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {Select, Store} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {DynamicDatePipe} from "@utility/pipes/dynamic-date.pipe";
import {ActiveStyleDirective} from "@utility/directives/active-style/active-style.directive";
import humanizeDuration from "humanize-duration";
import {Duration} from "luxon";
import {EventStatusStyleDirective} from "@event/directive/event-status-style/event-status-style.directive";

@Component({
  selector: 'event-detail-page',
  templateUrl: 'index.html',
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
    LoaderComponent,
    DatePipe,
    TranslateModule,
    EditLinkComponent,
    DynamicDatePipe,
    ActiveStyleDirective,
    CurrencyPipe,
    EventStatusStyleDirective
  ],
  standalone: true
})
export default class Index {

  // TODO add base index of details with store and delete method

  @Select(EventState.itemData)
  public readonly item$!: Observable<IEvent>;

  @HostBinding()
  public readonly class = 'p-4 block';

  public readonly store = inject(Store);
  public readonly translateService = inject(TranslateService);

  public delete(event: IEvent): void {
    this.store.dispatch(new EventActions.DeleteItem(event._id));
  }

  public formatDuration(duration: string): string {

    return humanizeDuration(Duration.fromISOTime(duration).as('milliseconds'), {language: this.translateService.currentLang});

  }

}
