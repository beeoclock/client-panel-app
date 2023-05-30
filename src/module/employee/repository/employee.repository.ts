import {Injectable} from '@angular/core';
import {EmployeeFirebaseAdapter} from '@employee/adapter/employee.firebase.adapter';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRepository extends EmployeeFirebaseAdapter {
}
