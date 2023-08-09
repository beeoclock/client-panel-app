import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {ICustomer} from '@customer/domain';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerState} from "@customer/state/customer/customer.state";
import {Select, Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {ActiveStyleDirective} from "@utility/directives/active-style/active-style.directive";
import {DynamicDatePipe} from "@utility/pipes/dynamic-date.pipe";

@Component({
  selector: 'customer-detail-page',
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
    DropdownComponent,
    LoaderComponent,
    TranslateModule,
    EditLinkComponent,
    ActiveStyleDirective,
    DynamicDatePipe
  ],
  standalone: true
})
export default class Index {

  // TODO add base index of details with store and delete method

  @Select(CustomerState.itemData)
  public readonly item$!: Observable<ICustomer>;

  @HostBinding()
  public readonly class = 'p-4 block';

  public readonly store = inject(Store);

  public delete(customer: ICustomer): void {
    this.store.dispatch(new CustomerActions.DeleteItem(customer._id));
  }

}
