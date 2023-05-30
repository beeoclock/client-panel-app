import {inject, Injectable} from '@angular/core';
import {EventFirebaseAdapter} from '@event/adapter/event.firebase.adapter';
import * as Event from "@event/domain";
import {FilterForm} from "@event/form/filter.form";
import {BooleanState, Pagination} from "@utility/domain";
import {httpsCallable} from "@angular/fire/functions";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class EventRepository extends EventFirebaseAdapter {

  public readonly pagination = new Pagination<Event.IEvent>();
  public readonly loading = new BooleanState(false);
  public readonly filterForm = new FilterForm();
  private readonly calendarCloudFunction;
  public readonly router = inject(Router);

  constructor() {
    super();

    this.calendarCloudFunction = httpsCallable(this.functions, `${this.path}Calendar`);
  }

  public calendar(from: string, to: string): Promise<null | { items: Event.IEvent[]; total: number; }> {
    return this.calendarCloudFunction({
      from,
      to
    }) as any;
  }

}
