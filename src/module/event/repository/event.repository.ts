import {Injectable} from '@angular/core';
import {EventFirebaseAdapter} from '@event/adapter/event.firebase.adapter';
import * as Event from "@event/domain";
import {FilterForm} from "@event/form/filter.form";
import {BooleanState, Pagination} from "@utility/domain";

@Injectable({
  providedIn: 'root'
})
export class EventRepository extends EventFirebaseAdapter {

  public readonly pagination = new Pagination<Event.IEvent>();
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
            title: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            description: {
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

}
