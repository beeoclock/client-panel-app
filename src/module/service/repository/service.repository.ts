import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {FilterForm} from '@service/form/filter.form';
import {ServiceFirebaseAdapter} from "@service/adapter/service.firebase.adapter";
import {BooleanState, Pagination} from "@utility/domain";

@Injectable()
export class ServiceRepository extends ServiceFirebaseAdapter {

  public readonly pagination = new Pagination<Service.IService>();
  public readonly loading = new BooleanState(false);
  public readonly filterForm = new FilterForm();

  constructor() {
    super();

    this.pagination.setDelegate(({orderDir, orderBy, pageSize, page}) => {

      this.loading.switchOn();

      const {search} = this.filterForm.value;
      const filters: any = {};

      if (search) {
        filters['$or'] = [
          {
            languageVersions: {
              $elemMatch: {
                "title": {
                  $regex: search ?? '',
                  $options: "i"
                },
              }
            }
          },
          {
            languageVersions: {
              $elemMatch: {
                "description": {
                  $regex: search ?? '',
                  $options: "i"
                },
              }
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
      ).then(({data}) => {
        const {total, items} = data;
        this.pagination
          .setTotalSize(total)
          .setItems(items);
      }).finally(() => {
        this.loading.switchOff();
      });

    });
  }


}
