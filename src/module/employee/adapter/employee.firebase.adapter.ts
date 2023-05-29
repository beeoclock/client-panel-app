import {Injectable} from '@angular/core';
import * as Employee from '@employee/domain';
import {CloudFunctionFirebaseRepository} from "@utility/repository/cloud-function.firebase.repository";

@Injectable({
  providedIn: 'root'
})
export class EmployeeFirebaseAdapter extends CloudFunctionFirebaseRepository<Employee.IEmployee> {

  constructor() {
    super();
    this.initCollectionReference('employee');
  }

}
