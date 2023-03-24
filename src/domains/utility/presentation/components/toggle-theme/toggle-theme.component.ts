import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  standalone: true,
  selector: 'utility-toggle-theme-component',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="theme-control-toggle">
      <input class="form-check-input ms-0 theme-control-toggle-input" data-theme-control="theme"
             id="themeControlToggle" type="checkbox" value="dark"/>
      <label class="mb-0 theme-control-toggle-label theme-control-toggle-light" data-bs-placement="left"
             data-bs-toggle="tooltip" for="themeControlToggle" title="Switch to light theme">
        <i class="bi bi-sun-fill"></i>
      </label>
      <label class="mb-0 theme-control-toggle-label theme-control-toggle-dark" data-bs-placement="left"
             data-bs-toggle="tooltip" for="themeControlToggle" title="Switch to dark theme">
        <i class="bi bi-moon-fill"></i>
      </label>
    </div>
  `
})
export class ToggleThemeComponent {

}
