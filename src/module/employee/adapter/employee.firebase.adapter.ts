import {Injectable} from '@angular/core';
import * as Employee from '@employee/domain';
import {FirebaseAdapter} from '@utility/adapter/firebase-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeFirebaseAdapter extends FirebaseAdapter<Employee.IEmployee> {

  constructor() {
    super();
    this.initCollectionReference('employee', 'createdAt');
  }

}
