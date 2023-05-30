import {Component, inject, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {is} from "thiis";
import {Store} from "@ngxs/store";

@Component({
  selector: 'utility-list-page',
  template: ``
})
export abstract class ListPage implements OnInit {
  public readonly repository: any;
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly store = inject(Store);
  public readonly actions!: {
    UpdatePaginationFromQueryParams: any;
    UpdateQueryParamsAtNavigator: any;
    DeleteItem: any;
  };

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (is.object.not.empty(params)) {
        this.store.dispatch(new this.actions.UpdatePaginationFromQueryParams(params));
      } else {
        this.store.dispatch(new this.actions.UpdateQueryParamsAtNavigator());
      }
    });
  }

  public delete(id: string): void {
    this.store.dispatch(new this.actions.DeleteItem({
      id
    }));
  }

}
