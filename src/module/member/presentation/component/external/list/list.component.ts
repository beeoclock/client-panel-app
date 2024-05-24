import {ChangeDetectionStrategy, Component, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {
    MobileLayoutListComponent
} from "@member/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
    DesktopLayoutListComponent
} from "@member/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {RIMember} from "@member/domain";
import {MemberState} from "@member/state/member/member.state";
import {MemberActions} from "@member/state/member/member.actions";

@Component({
    selector: 'member-external-list-component',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        NgIf,
        TranslateModule,
        DesktopLayoutListComponent,
        MobileLayoutListComponent,
    ],
    standalone: true
})
export class MemberExternalListComponent extends ListPage {

    @ViewChildren(MobileLayoutListComponent)
    public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;

    public override readonly actions = MemberActions;

    public readonly tableState$: Observable<ITableState<RIMember>> = this.store.select(MemberState.tableState)
        .pipe(
            tap((tableState) => {
                this.changeDetectorRef.detectChanges();
            })
        );

}
