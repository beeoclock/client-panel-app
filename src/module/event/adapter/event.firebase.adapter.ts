import {Injectable} from '@angular/core';
import * as Event from '@event/domain';
import {FirebaseAdapter} from '@utility/adapter/firebase-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class EventFirebaseAdapter extends FirebaseAdapter<Event.Interface.IEvent> {

  constructor() {
    super();
    this.initCollectionReference('event');
  }

}
