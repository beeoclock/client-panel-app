import {Component, inject, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {ProfileComponent} from "@utility/presentation/component/profile/profile.component";
import {SidebarService} from "@utility/presentation/component/sidebar/sidebar.service";

@Component({
  standalone: true,
  selector: 'utility-navbar-component',
  templateUrl: './navbar.component.html',
  encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		ProfileComponent,
	]
})
export class NavbarComponent {
  public readonly sidebarService = inject(SidebarService);
}
