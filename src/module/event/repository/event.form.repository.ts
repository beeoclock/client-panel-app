import {Injectable} from '@angular/core';
import {EventFirebaseAdapter} from '@event/adapter/event.firebase.adapter';
import * as Event from "@event/domain";
import {FilterForm} from "@event/form/filter.form";
import {BooleanState, Pagination} from "@utility/domain";

@Injectable({
  providedIn: 'root'
})
export class EventFormRepository extends EventFirebaseAdapter {

  public readonly pagination = new Pagination<Event.IEvent>();
  public readonly loading = new BooleanState(false);
  public readonly filterForm = new FilterForm();

}
