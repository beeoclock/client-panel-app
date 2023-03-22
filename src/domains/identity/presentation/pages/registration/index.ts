import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {utils} from '@src/scripts/utls';
import {wizardInit} from '@src/scripts/wizard';

@Component({
  selector: 'identity-registration-page',
  templateUrl: 'index.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export default class Index implements AfterViewInit {

  public ngAfterViewInit(): void {

    utils.docReady(wizardInit);

  }

}
