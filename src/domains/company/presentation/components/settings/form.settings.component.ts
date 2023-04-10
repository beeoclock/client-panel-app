import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {InputComponent} from '@utility/presentation/components/input/input.component';
import {TextareaComponent} from '@utility/presentation/components/textarea/textarea.component';
import {ButtonComponent} from '@utility/presentation/components/button/button.component';

@Component({
  selector: 'form[company-form-settings-component]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputComponent,
    InputComponent,
    TextareaComponent,
    InputComponent,
    TextareaComponent,
    ButtonComponent
  ],
  template: `
    <div class="col-lg-6">
      <label class="form-label" for="first-name">First Name</label>
      <input beeoclock id="first-name" value="Anthony">
    </div>
    <div class="col-lg-6">
      <label class="form-label" for="last-name">Last Name</label>
      <input beeoclock id="last-name" value="Hopkins">
    </div>
    <div class="col-lg-6">
      <label class="form-label" for="email1">Email</label>
      <input beeoclock id="email1" value="anthony@gmail.com">
    </div>
    <div class="col-lg-6">
      <label class="form-label" for="email2">Phone</label>
      <input beeoclock id="email2" value="+44098098304">
    </div>
    <div class="col-lg-12">
      <label class="form-label" for="email3">Heading</label>
      <input beeoclock id="email3" value="Software Engineer">
    </div>
    <div class="col-lg-12">
      <label class="form-label" for="intro">Intro</label>
      <textarea beeoclock id="intro" name="intro" cols="30" rows="13">
        Text
      </textarea>
    </div>
    <div class="col-12 d-grid">
      <button beeoclock>Update</button>
    </div>
  `
})
export class FormSettingsComponent {
  @HostBinding()
  public class = ['row', 'g-3'];
}
