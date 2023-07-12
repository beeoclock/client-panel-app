import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {CloudFunctionFirebaseRepository} from "@utility/repository/cloud-function.firebase.repository";

@Injectable({
  providedIn: 'root'
})
export class ServiceFirebaseAdapter extends CloudFunctionFirebaseRepository<Service.IService> {

  constructor() {
    super();
    this.initCollectionReference('service');
  }

}
