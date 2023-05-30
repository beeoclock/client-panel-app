import {Injectable} from '@angular/core';
import {ServiceFirebaseAdapter} from "@service/adapter/service.firebase.adapter";

@Injectable({
  providedIn: 'root'
})
export class ServiceRepository extends ServiceFirebaseAdapter {


}
