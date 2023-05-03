import {Component, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgIf} from '@angular/common';
import {SignUpComponent} from '@identity/presentation/component/sign-up.component/sign-up.component';

@Component({
  selector: 'identity-sign-up-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    NgIf,
    SignUpComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

}
