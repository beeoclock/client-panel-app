import {Injectable} from '@angular/core';
import * as Employee from '@employee/domain';
import {CloudFunctionFirebaseAdapter} from "@utility/adapter/cloud-function.firebase.adapter";

@Injectable({
  providedIn: 'root'
})
export class EmployeeFirebaseAdapter extends CloudFunctionFirebaseAdapter<Employee.IEmployee> {

  constructor() {
    super();
    this.initCollectionReference('employee');
  }

}
