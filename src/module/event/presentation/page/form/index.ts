import {Component, HostBinding, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {EventForm} from '@event/form/event.form';
import {AttendeesComponent} from '@event/presentation/component/form/attendees/attendees.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IEvent} from "@event/domain";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {LanguagePipe} from "@utility/pipes/language.pipe";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {filter, firstValueFrom, Observable} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {EventActions} from "@event/state/event/event.actions";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {SelectTimeSlotComponent} from "@event/presentation/component/form/select-time-slot/select-time-slot.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {ServicesComponent} from "@event/presentation/component/form/services/services.component";


@Component({
  selector: 'event-form-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    ReactiveFormsModule,
    InputDirective,
    DeleteButtonComponent,
    HasErrorDirective,
    RouterLink,
    BackLinkComponent,
    FormsModule,
    AttendeesComponent,
    HeaderCardComponent,
    NgSelectModule,
    NgForOf,
    LanguagePipe,
    NgIf,
    DatePipe,
    InvalidTooltipDirective,
    TranslateModule,
    IonicModule,
    FormInputComponent,
    SelectTimeSlotComponent,
    FormTextareaComponent,
    AttendeesComponent,
    ServicesComponent,
  ],
  standalone: true
})
export default class Index implements OnInit {

  // TODO move functions to store effects/actions

  public isEditMode = false;

  private readonly store = inject(Store);
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly router = inject(Router);

  public readonly form = new EventForm();

  @Select(EventState.itemData)
  public itemData$!: Observable<IEvent | undefined>;


  @HostBinding()
  public readonly class = 'md:p-4 block';

  public ngOnInit(): void {

    this.detectItem();

  }

  public detectItem(): void {
    firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
      firstValueFrom(this.itemData$).then((result) => {
        if (result?._id) {
          this.isEditMode = true;
          const {attendees, ...rest} = result;
          this.form.patchValue(rest);
          if (attendees?.length) {
            this.form.controls.attendees.remove(0);
            attendees.forEach((attendee) => {
              this.form.controls.attendees.pushNewOne(attendee);
            });
          }
          this.form.updateValueAndValidity();
        }
      });
    });
  }

  public async save(): Promise<void> {
    this.form.updateValueAndValidity();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      const redirectUri = ['../'];
      const value = this.form.getRawValue() as IEvent;
      if (this.isEditMode) {
        await firstValueFrom(this.store.dispatch(new EventActions.UpdateItem(value)));
      } else {
        await firstValueFrom(this.store.dispatch(new EventActions.CreateItem(value)));
        const item = await firstValueFrom(this.itemData$);
        if (item && item._id) {
          redirectUri.push(item._id);
        }
      }
      await this.router.navigate(redirectUri, {
        relativeTo: this.activatedRoute
      });

      // TODO check if customers/attends is exist in db (just check if selected customer has _id field if exist is in db if not then need to make request to create the new customer)

      this.form.enable();
      this.form.updateValueAndValidity();

    }
  }

}
