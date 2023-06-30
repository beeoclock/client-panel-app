import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';

import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {TranslateModule} from "@ngx-translate/core";
import {Select, Store} from "@ngxs/store";
import {CustomerForm} from "@customer/form/customer.form";
import {CustomerState} from "@customer/state/customer/customer.state";
import {filter, firstValueFrom, Observable} from "rxjs";
import {ICustomer} from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";

@Component({
  selector: 'member-form-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    ReactiveFormsModule,
    InputDirective,
    TextareaDirective,
    ButtonComponent,

    HasErrorDirective,
    RouterLink,
    BackLinkComponent,
    HeaderCardComponent,
    InvalidTooltipDirective,
    TranslateModule
  ],
  standalone: true
})
export default class Index implements OnInit {

  // TODO move functions to store effects/actions

  public readonly baseUrl = '/member';
  public readonly cancelUrl = [this.baseUrl];

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly form = new CustomerForm();

  @Select(CustomerState.itemData)
  public itemData$!: Observable<ICustomer | undefined>;

  public ngOnInit(): void {
    this.detectItem();
  }

  public detectItem(): void {
    firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
      firstValueFrom(this.itemData$).then((result) => {
        if (result) {
          this.cancelUrl.push('details', result._id);
          this.form.patchValue(result);
          this.form.updateValueAndValidity();
        }
      });
    });
  }

  public async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      await firstValueFrom(this.store.dispatch(new CustomerActions.SaveItem(this.form.value as ICustomer)));
      const item = await firstValueFrom(this.itemData$);
      if (item) {
        await this.router.navigate([this.baseUrl, 'details', item?._id], {
          relativeTo: this.activatedRoute
        });
      }
      this.form.enable();
      this.form.updateValueAndValidity();

    }
  }
}
