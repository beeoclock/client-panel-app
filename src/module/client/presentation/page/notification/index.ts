import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ClientRepository} from "@module/client/repository/client.repository";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'client-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [],
  standalone: true
})
export default class Index {

  private readonly repository = inject(ClientRepository);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.params.subscribe((params: Params & {id?: string}) => {
      console.log(params);
    })
  }

}
