import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {SpinnerComponent} from "@utility/presentation/component/spinner/spinner.component";
import {BooleanState, Pagination} from "@utility/domain";

@Component({
  selector: 'tbody[utility-body-table-component]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgIf,
    SpinnerComponent,
    AsyncPipe
  ],
  template: `
    <ng-container *ngIf="loader.isOff; else LoadingTemplate">
      <ng-container *ngIf="pagination.totalSize; else EmptyTemplate">
        <ng-content></ng-content>
      </ng-container>
    </ng-container>

    <ng-template #LoadingTemplate>
      <div class="p-4">
        <div spinner></div>
      </div>
    </ng-template>

    <ng-template #EmptyTemplate>
      <tr>
        <td colspan="4">
          No Data!
        </td>
      </tr>
    </ng-template>
  `
})
export class BodyTableComponent {

  @HostBinding()
  public readonly class = 'list';

  @HostBinding()
  public readonly id = 'table-body';

  @Input()
  public loader = new BooleanState(false);

  @Input()
  public pagination = new Pagination<any>();
}
