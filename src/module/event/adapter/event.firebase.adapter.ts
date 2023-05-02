import {Injectable} from '@angular/core';
import * as Event from '@event/domain';
import {CloudFunctionFirebaseAdapter} from "@utility/adapter/cloud-function.firebase.adapter";

@Injectable({
  providedIn: 'root'
})
export class EventFirebaseAdapter extends CloudFunctionFirebaseAdapter<Event.IEvent> {

  constructor() {
    super();
    this.initCollectionReference('event');
  }

}
