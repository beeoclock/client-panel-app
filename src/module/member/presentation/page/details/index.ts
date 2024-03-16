import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {firstValueFrom, Observable} from 'rxjs';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {Select, Store} from "@ngxs/store";
import {MemberState} from "@member/state/member/member.state";
import {MemberActions} from "@member/state/member/member.actions";
import {RIMember} from "@member/domain";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";

@Component({
  selector: 'member-detail-page',
  templateUrl: './index.html',
  encapsulation: ViewEncapsulation.None,
	imports: [
		NgIf,
		AsyncPipe,
		SpinnerComponent,
		BackLinkComponent,
		BackLinkComponent,
		DeleteButtonComponent,
		RouterLink,
		DropdownComponent,
		LoaderComponent,
		TranslateModule,
		EditLinkComponent,
		BackButtonComponent,
		DefaultPanelComponent,
		DynamicDatePipe
	],
  standalone: true
})
export default class Index {

  @Select(MemberState.itemData)
  public readonly item$!: Observable<RIMember>;

  public readonly store = inject(Store);
  public readonly router = inject(Router);

  public delete(id: string): void {
    firstValueFrom(this.store.dispatch(new MemberActions.DeleteItem(id))).then(() => {
			this.router.navigate(['/', 'member', 'list']);
		});
  }

}
