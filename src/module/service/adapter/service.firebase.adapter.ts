import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {FirebaseAdapter} from '@utility/adapter/firebase-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceFirebaseAdapter extends FirebaseAdapter<Service.IService> {

  constructor() {
    super();
    this.initCollectionReference('service', 'createdAt');
  }

}
