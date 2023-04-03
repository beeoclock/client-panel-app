import {Component, Input} from '@angular/core';

@Component({
  selector: 'utility-getting-started-component',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-body overflow-hidden p-lg-6">
        <div class="row align-items-center">
          <div class="col-lg-6"><img alt="" class="img-fluid" src="assets/img/icons/spot-illustrations/21.png">
          </div>
          <div class="col-lg-6 ps-lg-4 my-5 text-center text-lg-start">
            <h3 class="text-primary">{{ title }}</h3>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GettingStartedComponent {

  @Input()
  public title = 'title';

}
