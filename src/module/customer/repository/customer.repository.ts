import {inject, Injectable} from '@angular/core';
import {CustomerFirebaseAdapter} from '@customer/adapter/customer.firebase.adapter';
import {FilterForm} from "@customer/form/filter.form";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CustomerRepository extends CustomerFirebaseAdapter {

  public readonly filterForm = new FilterForm();
  public readonly router = inject(Router);

  constructor() {
    super();
  }

  public delete(id: string, refreshList = false): void {
    this.remove(id).then((result) => {
      if (result) {
        if (refreshList) {
          // this.pagination.executeDelegate();
        } else {
          this.router.navigate(['/', 'customer']);
        }
      }
    });
  }

}
