import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {TranslateModule} from "@ngx-translate/core";
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {IMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";
import {MemberState} from "@member/state/member/member.state";
import {ITableState} from "@utility/domain/table.state";
import {
  TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {FilterComponent} from "@member/presentation/component/filter/filter.component";
import {DynamicDatePipe} from "@utility/pipes/dynamic-date.pipe";

@Component({
  selector: 'member-list-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CardComponent,
        BodyCardComponent,
        RouterLink,
        DeleteButtonComponent,
        TableComponent,
        HeaderTableComponent,
        BodyTableComponent,
        NgForOf,
        DatePipe,
        FilterComponent,
        DropdownComponent,
        NgIf,
        SortIndicatorComponent,
        LoaderComponent,
        ActionComponent,
        TranslateModule,
        AsyncPipe,
        TableStatePaginationComponent,
        FilterComponent,
        DynamicDatePipe
    ],
  standalone: true
})
export default class Index extends ListPage {

  public override readonly actions = MemberActions;

  @Select(MemberState.tableState)
  public readonly tableState$!: Observable<ITableState<IMember>>;

  @Select(MemberState.tableStateItems)
  public readonly items$!: Observable<IMember[]>;

}
