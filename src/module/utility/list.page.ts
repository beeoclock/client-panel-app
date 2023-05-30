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
  };

  public ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (is.object.not.empty(params)) {
        console.log(params);
        this.store.dispatch(new this.actions.UpdatePaginationFromQueryParams(params));
      } else {
        this.store.dispatch(new this.actions.UpdateQueryParamsAtNavigator());
      }
    });
    // this.repository.pagination.executeDelegate();
  }

}
