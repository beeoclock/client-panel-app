import {Injectable} from '@angular/core';
import * as Event from "@event/domain";
import {BooleanState, Pagination} from "@utility/domain";
import {EventApiAdapter} from "@event/adapter/event.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class EventRepository extends EventApiAdapter {

  public readonly pagination = new Pagination<Event.IEvent>();
  public readonly loading = new BooleanState(false);

  public calendar(from: string, to: string): Promise<null | { items: Event.IEvent[]; total: number; }> {
    return {} as any;
  }

}
