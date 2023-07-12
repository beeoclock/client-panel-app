import {Injectable} from '@angular/core';
import * as Client from '@module/client/domain'
import {CloudFunctionFirebaseRepository} from "@utility/repository/cloud-function.firebase.repository";

@Injectable({
  providedIn: 'root'
})
export class ClientFirebaseAdapter extends CloudFunctionFirebaseRepository<Client.ISettings> {

  constructor() {
    super();
    this.initCollectionReference('client');
  }

}
