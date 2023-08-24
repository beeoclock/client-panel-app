import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {NgIf} from "@angular/common";
import {ImageBlockComponent} from "@service/presentation/component/form/v2/image/image-block.component";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DetailsBlockComponent} from "@service/presentation/component/form/v2/details/details-block.component";
import {PricesBlockComponent} from "@service/presentation/component/form/v2/prices/prices-block.component";
import {
  SpecialistsBlockComponent
} from "@service/presentation/component/form/v2/specialists/specialists-block.component";
import {ServiceForm} from "@service/presentation/form/service.form";
import {filter, firstValueFrom, Observable} from "rxjs";
import {ServiceActions} from "@service/state/service/service.actions";
import {IService} from "@service/domain";
import {Select, Store} from "@ngxs/store";
import {ServiceState} from "@service/state/service/service.state";
import {ActivatedRoute, Router} from "@angular/router";
import {SwitchActiveBlockComponent} from "@utility/presentation/component/switch-active/switch-active-block.component";

@Component({
  selector: 'service-form-v2-page-component',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    BackLinkComponent,
    NgIf,
    ImageBlockComponent,
    ReactiveFormsModule,
    TranslateModule,
    DetailsBlockComponent,
    PricesBlockComponent,
    SpecialistsBlockComponent,
    SwitchActiveBlockComponent,
  ]
})
export default class Index implements OnInit {

  public readonly form = new ServiceForm();

  public readonly store = inject(Store);
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly router = inject(Router);

  @Select(ServiceState.itemData)
  public itemData$!: Observable<IService | undefined>;
  private isEditMode = false;

  public ngOnInit(): void {
    this.detectItem();
  }

  public detectItem(): void {
    firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
      firstValueFrom(this.itemData$).then((result) => {
        if (result) {
          this.isEditMode = true;

          const {durationVersions, ...rest} = result;
          this.form.patchValue(rest);

          // Prevents from removing all controls from durationVersions
          this.form.controls.durationVersions.removeControls();
          // Add new controls to durationVersions
          durationVersions.forEach((durationVersion) => {
            this.form.controls.durationVersions.pushNewOne(durationVersion);
          });

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
        await firstValueFrom(this.store.dispatch(new ServiceActions.UpdateItem(this.form.getRawValue() as IService)));
      } else {
        await firstValueFrom(this.store.dispatch(new ServiceActions.CreateItem(this.form.getRawValue() as IService)));
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
