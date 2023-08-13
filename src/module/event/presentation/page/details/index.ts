import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {firstValueFrom, Observable} from 'rxjs';
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
import {StatusEnum} from "@event/domain/enum/status.enum";
import {CardComponent} from "@utility/presentation/component/card/card.component";

@Component({
  selector: 'event-detail-page',
  templateUrl: 'index.html',
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
    LoaderComponent,
    DatePipe,
    TranslateModule,
    EditLinkComponent,
    DynamicDatePipe,
    ActiveStyleDirective,
    CurrencyPipe,
    EventStatusStyleDirective,
    NgTemplateOutlet,
    CardComponent
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

  public formatDuration(duration: string): string {
    return humanizeDuration(Duration.fromISOTime(duration).as('milliseconds'), {language: this.translateService.currentLang});
  }

  public async changeStatusOnBooked(event: IEvent): Promise<void> {
    await firstValueFrom(this.store.dispatch(new EventActions.BookedStatus(event)));
    await firstValueFrom(this.store.dispatch(new EventActions.GetItem(event._id)));
  }

  public async changeStatusOnCancelled(event: IEvent): Promise<void> {
    await firstValueFrom(this.store.dispatch(new EventActions.CancelledStatus(event)));
    await firstValueFrom(this.store.dispatch(new EventActions.GetItem(event._id)));
  }

  public async changeStatusOnDone(event: IEvent): Promise<void> {
    await firstValueFrom(this.store.dispatch(new EventActions.DoneStatus(event)));
    await firstValueFrom(this.store.dispatch(new EventActions.GetItem(event._id)));
  }

  public isRequested(status: StatusEnum): boolean {
    return status === StatusEnum.requested;
  }

  public isBooked(status: StatusEnum): boolean {
    return status === StatusEnum.booked;
  }

  public isDone(status: StatusEnum): boolean {
    return status === StatusEnum.done;
  }

  public isCancelled(status: StatusEnum): boolean {
    return status === StatusEnum.cancelled;
  }

}
