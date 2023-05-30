import {Component, EventEmitter, Input, Output} from "@angular/core";
import {RouterLink} from "@angular/router";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";

@Component({
  selector: 'utility-table-column-action',
  standalone: true,
  imports: [
    RouterLink,
    DropdownComponent
  ],
  template: `
    <utility-dropdown [threeDot]="true" id="table-row-{{ id }}">
      <ng-container content>
        <li>
          <a
            [routerLink]="['details', id]"
            class="text-start block px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeColor-600 dark:hover:text-white">
            <i class="bi bi-eye"></i>
            Details
          </a>
        </li>
        <li>
          <a
            [routerLink]="['form', id]"
            class="text-start block px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeColor-600 dark:hover:text-white">
            <i class="bi bi-pencil"></i>
            Edit
          </a>
        </li>
        <li>
          <button
            (click)="delete.emit(id)"
            class="text-start block w-full px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeColor-600 dark:hover:text-white">
            <i class="bi bi-trash"></i>
            Delete
          </button>
        </li>
      </ng-container>
    </utility-dropdown>
  `
})
export class ActionComponent {

  @Input()
  public id!: string;

  @Output()
  public readonly delete = new EventEmitter<string>();

}
