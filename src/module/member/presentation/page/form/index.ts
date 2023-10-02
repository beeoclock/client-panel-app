import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {TranslateModule} from "@ngx-translate/core";
import {Select, Store} from "@ngxs/store";
import {MemberForm} from "@member/presentation/form/member.form";
import {MemberState} from "@member/state/member/member.state";
import {filter, firstValueFrom, Observable} from "rxjs";
import {IMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";

@Component({
  selector: 'member-form-page',
  templateUrl: './index.html',
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
        PrimaryButtonDirective
    ],
  standalone: true
})
export default class Index implements OnInit {

  // TODO move functions to store effects/actions

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public form = new MemberForm();

  @Select(MemberState.itemData)
  public itemData$!: Observable<IMember | undefined>;
  private isEditMode = false;

  public ngOnInit(): void {
    this.detectItem();
  }

  public detectItem(): void {
    firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
      firstValueFrom(this.itemData$).then((result) => {
        if (result) {
          this.isEditMode = true;
          this.form = MemberForm.create(result);
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
        await firstValueFrom(this.store.dispatch(new MemberActions.UpdateItem(this.form.getRawValue() as IMember)));
      } else {
        await firstValueFrom(this.store.dispatch(new MemberActions.CreateItem(this.form.getRawValue() as IMember)));
        const item = await firstValueFrom(this.itemData$);
        if (item && item._id) {
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
