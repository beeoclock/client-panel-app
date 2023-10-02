import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {Observable} from 'rxjs';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {Select} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {IEvent} from "@event/domain";
import {TranslateModule} from "@ngx-translate/core";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {ButtonsDetailsComponent} from "@event/presentation/component/details/buttons.details.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";

@Component({
  selector: 'event-detail-page',
  templateUrl: './index.html',
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
    CardComponent,
    MetaDetailsComponent,
    ButtonsDetailsComponent,
    GeneralDetailsComponent
  ],
  standalone: true
})
export default class Index {

  // TODO add base index of details with store and delete method

  @Select(EventState.itemData)
  public readonly item$!: Observable<IEvent>;

  @HostBinding()
  public readonly class = 'p-4 block';

}
