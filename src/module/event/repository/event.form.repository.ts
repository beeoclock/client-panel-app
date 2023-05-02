import {Injectable} from '@angular/core';
import {EventFirebaseAdapter} from '@event/adapter/event.firebase.adapter';

@Injectable({
  providedIn: 'root'
})
export class EventFormRepository extends EventFirebaseAdapter {
}
