import {inject, Injectable} from '@angular/core';
import {CustomerFirebaseAdapter} from '@customer/adapter/customer.firebase.adapter';
import {BooleanState, Pagination} from "@utility/domain";
import * as Customer from "@customer/domain";
import {FilterForm} from "@customer/form/filter.form";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CustomerRepository extends CustomerFirebaseAdapter {

  public readonly pagination = new Pagination<Customer.ICustomer>();
  public readonly loading = new BooleanState(false);
  public readonly filterForm = new FilterForm();
  public readonly router = inject(Router);

  constructor() {
    super();

    this.pagination.setDelegate(({orderDir, orderBy, pageSize, page}) => {

      this.loading.switchOn();

      const {search} = this.filterForm.value;
      const filters: any = {};

      if (search) {
        filters['$or'] = [
          {
            firstName: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            lastName: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            email: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            phone: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            note: {
              $regex: search ?? '',
              $options: "i"
            }
          },
        ];
      }

      this.list(
        pageSize,
        page,
        orderBy,
        orderDir,
        filters
      ).then(({data}: any) => {
        const {total, items} = data;
        this.pagination
          .setTotalSize(total)
          .setItems(items);
      }).finally(() => {
        this.loading.switchOff();
      });

    });
  }

  public delete(id: string, refreshList: boolean = false): void {
    this.remove(id).then((result) => {
      if (result) {
        if (refreshList) {
          this.pagination.executeDelegate();
        } else {
          this.router.navigate(['/', 'customer']);
        }
      }
    });
  }

}
