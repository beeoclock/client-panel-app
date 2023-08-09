import {Component, EventEmitter, Input, Output} from "@angular/core";
import {RouterLink} from "@angular/router";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {ActiveEnum} from "@utility/domain/enum";
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'utility-table-column-action',
  standalone: true,
  imports: [
    RouterLink,
    DropdownComponent,
    NgIf,
    TranslateModule
  ],
  template: `
    <utility-dropdown [threeDot]="true" [id]="'table-row-' + id">
      <ng-container content>
        <li>
          <a
            [routerLink]="id"
            class="text-start block px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
            <i class="bi bi-eye"></i>
            {{ 'general.details' | translate }}
          </a>
        </li>
        <li>
          <a
            [routerLink]="[id, 'form']"
            class="text-start block px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
            <i class="bi bi-pencil"></i>
            {{ 'general.edit' | translate }}
          </a>
        </li>
<!--        <li *ngIf="active === activeEnum.NO">-->
<!--          <button-->
<!--            (click)="delete.emit(id)"-->
<!--            class="text-start block w-full px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">-->
<!--            <i class="bi bi-trash"></i>-->
<!--            {{ 'general.delete' | translate }}-->
<!--          </button>-->
<!--        </li>-->
<!--        <li *ngIf="active === activeEnum.YES">-->
<!--          <button-->
<!--            (click)="archive.emit(id)"-->
<!--            class="text-start block w-full px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">-->
<!--            <i class="bi bi-archive"></i>-->
<!--            Archive-->
<!--          </button>-->
<!--        </li>-->
      </ng-container>
    </utility-dropdown>
  `
})
export class ActionComponent {

  @Input()
  public id!: string;

  @Input()
  public active!: ActiveEnum;

  @Output()
  public readonly delete = new EventEmitter<string>();

  @Output()
  public readonly archive = new EventEmitter<string>();

  public readonly activeEnum = ActiveEnum;

}
