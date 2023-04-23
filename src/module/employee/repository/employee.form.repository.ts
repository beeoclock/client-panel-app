import {inject, Injectable} from '@angular/core';
import {DocumentSnapshot} from '@angular/fire/firestore';
import {QuerySnapshot} from '@angular/fire/compat/firestore';
import * as Employee from '@employee/domain';
import {EmployeeFirebaseAdapter} from '@employee/adapter/employee.firebase.adapter';
import {Repository} from '@utility/repository/repository';

@Injectable({
  providedIn: 'root'
})
export class EmployeeFormRepository extends Repository {
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
