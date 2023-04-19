import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import * as Utility from '@utility/domain';
import * as Employee from '@employee/domain';
import {EmployeeFirebaseAdapter} from '@employee/adapter/employee.firebase.adapter';

@Injectable({
  providedIn: 'root'
})
export class EmployeeFormRepository extends Utility.Repository.Repository {
  private readonly storageAdapter: EmployeeFirebaseAdapter = inject(EmployeeFirebaseAdapter);

  public override async save(value: any, forceId?: string | null | undefined): Promise<void> {
    return await this.storageAdapter.save(value, forceId);
  }

  public override item(id: string): Promise<DocumentSnapshot<Employee.IEmployee>> {
    return this.storageAdapter.item(id);
  }

  public override list(): Promise<QuerySnapshot<Employee.IEmployee>> {
    return this.storageAdapter.list();
  }
}
