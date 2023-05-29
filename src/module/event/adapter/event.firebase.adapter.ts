import {Injectable} from '@angular/core';
import * as Event from '@event/domain';
import {CloudFunctionFirebaseRepository} from "@utility/repository/cloud-function.firebase.repository";

@Injectable({
  providedIn: 'root'
})
export class EventFirebaseAdapter extends CloudFunctionFirebaseRepository<Event.IEvent> {

  constructor() {
    super();
    this.initCollectionReference('event');
  }

}
