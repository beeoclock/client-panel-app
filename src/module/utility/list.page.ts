import {Component, inject, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'utility-list-page',
  template: ``
})
export abstract class ListPage implements OnInit {
  public readonly repository: any;
  public readonly router = inject(Router);
  public readonly activatedRoute = inject(ActivatedRoute);

  public ngOnInit() {
    this.repository.pagination.setDelegate((pagination: any) => {
      this.router.navigate([], {
        queryParams: pagination.toQueryParams(),
        queryParamsHandling: "merge",
      });
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.repository.pagination.fromQueryParams(params);
      this.repository.pagination.executeDelegate();
    });
  }

}
