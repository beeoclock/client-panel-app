import {inject, Injectable} from "@angular/core";
import {EventForm} from "@event/presentation/form/event.form";
import {IAttendee, IEvent} from "@event/domain";
import {firstValueFrom, Observable} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {environment} from "@environment/environment";
import {Select, Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {EventState} from "@event/state/event/event.state";

@Injectable({
  providedIn: 'root'
})
export class FormRepository {

  public isEditMode = false;
  public isRepeatMode = true;

  public readonly form = new EventForm();

  private readonly store = inject(Store);
  private readonly router = inject(Router);

  @Select(EventState.itemData)
  public itemData$!: Observable<IEvent | undefined>;

  public switchOnEditMode(item: IEvent): void {

    this.isEditMode = true;
    this.fillForm(item, true);

  }

  public switchOnRepeatMode(item: IEvent): void {

    const {start, end, status, _id, attendees, ...initialValue} = item;
    this.fillForm(initialValue as IEvent, true);
    this.isRepeatMode = true;

  }

  public fillForm(item: IEvent, disable = false) {

    this.form.disable();
    this.form.markAsPending();

    const {attendees, ...rest} = item;

    this.form.patchValue(rest);

    this.form.enable();
    this.form.updateValueAndValidity();

    if (attendees?.length) {

      this.prepareAttendees(attendees, disable);

    }

  }

  public prepareAttendees(attendees: IAttendee[], disable = false): void {

    if (!attendees?.length) {
      return;
    }

    this.form.controls.attendees.remove(0);

    attendees.forEach((attendee) => {

      const control = this.form.controls.attendees.pushNewOne(attendee);
      if (disable) {
        control.disable();
      }

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

        // Reset redirect uri
        redirectUri.length = 0;
        redirectUri.push('/', 'event');

        await firstValueFrom(this.store.dispatch(new EventActions.CreateItem(value)));
        const item = await firstValueFrom(this.itemData$);

        if (item && item._id) {

          redirectUri.push(item._id);

        }

      }

      await this.router.navigate(redirectUri);

      // TODO check if customers/attends is exist in db (just check if selected customer has _id field if exist is in db if not then need to make request to create the new customer)

      this.form.enable();
      this.form.updateValueAndValidity();

    } else {
      if (!environment.production) {
        console.log(this.form, this.form.getRawValue());
      }
    }
  }

}
