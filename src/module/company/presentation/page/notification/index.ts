import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CompanyRepository} from "@company/repository/company.repository";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'company-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [],
  standalone: true
})
export default class Index {

  private readonly repository = inject(CompanyRepository);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.params.subscribe((params: Params & {id?: string}) => {
      console.log(params);
    })
  }

}
