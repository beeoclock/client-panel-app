import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {CloudFunctionFirebaseAdapter} from "@utility/adapter/cloud-function.firebase.adapter";

@Injectable({
  providedIn: 'root'
})
export class ServiceFirebaseAdapter extends CloudFunctionFirebaseAdapter<Service.IService> {

  constructor() {
    super();
    this.initCollectionReference('service');
  }

}
