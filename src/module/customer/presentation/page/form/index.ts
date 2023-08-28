import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {ICustomer} from "@customer/domain";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerState} from "@customer/state/customer/customer.state";
import {filter, firstValueFrom, Observable} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {SwitchActiveBlockComponent} from "@utility/presentation/component/switch-active/switch-active-block.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {CustomerForm} from "@customer/presentation/form";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";

@Component({
  selector: 'customer-form-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
    imports: [
        ReactiveFormsModule,
        DeleteButtonComponent,
        HasErrorDirective,
        RouterLink,
        BackLinkComponent,
        InvalidTooltipDirective,
        TranslateModule,
        FormInputComponent,
        SwitchActiveBlockComponent,
        FormTextareaComponent,
        CardComponent,
        PrimaryButtonDirective
    ],
  standalone: true
})
export default class Index implements OnInit {

  // TODO move functions to store effects/actions

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly form = new CustomerForm();

  @Select(CustomerState.itemData)
  public itemData$!: Observable<ICustomer | undefined>;
  private isEditMode = false;

  public ngOnInit(): void {
    this.detectItem();
  }

  public detectItem(): void {
    firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
      firstValueFrom(this.itemData$).then((result) => {
        if (result) {
          this.isEditMode = true;
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
      const redirectUri = ['../'];
      if (this.isEditMode) {
        await firstValueFrom(this.store.dispatch(new CustomerActions.UpdateItem(this.form.getRawValue() as ICustomer)));
      } else {
        await firstValueFrom(this.store.dispatch(new CustomerActions.CreateItem(this.form.getRawValue() as ICustomer)));
        const item = await firstValueFrom(this.itemData$);
        if (item) {
          redirectUri.push(item._id);
        }
      }
      await this.router.navigate(redirectUri, {
        relativeTo: this.activatedRoute
      });
      this.form.enable();
      this.form.updateValueAndValidity();

    }
  }
}
