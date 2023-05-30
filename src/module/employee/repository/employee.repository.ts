import {inject, Injectable} from '@angular/core';
import {EmployeeFirebaseAdapter} from '@employee/adapter/employee.firebase.adapter';
import {BooleanState, Pagination} from "@utility/domain";
import {FilterForm} from "@employee/form/filter.form";
import {Router} from "@angular/router";
import {IEmployee} from "@employee/domain";

@Injectable({
  providedIn: 'root'
})
export class EmployeeRepository extends EmployeeFirebaseAdapter {

  public readonly pagination = new Pagination<IEmployee>();
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
            secondName: {
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
        // this.pagination
        //   .setTotalSize(total)
        //   .setItems(items);
      }).finally(() => {
        this.loading.switchOff();
      });

    });
  }

  public delete(id: string, refreshList = false): void {
    this.remove(id).then((result) => {
      if (result) {
        if (refreshList) {
          this.pagination.executeDelegate();
        } else {
          this.router.navigate(['/', 'employee']);
        }
      }
    });
  }
}
