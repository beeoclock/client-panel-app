import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-popover-menu-event-component',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        IonicModule,
        TranslateModule
    ],
    template: `
        <ion-content>
            <ion-list>
                <ion-item (click)="onClick('freeMovement')" [button]="true" [detail]="false">
                    {{ 'keyword.singular.capitalize.freeMovement' | translate }}
                </ion-item>
                <ion-item (click)="onClick('openDetails')" [button]="true" [detail]="false">
                    {{ 'keyword.singular.capitalize.openDetails' | translate }}
                </ion-item>
            </ion-list>
        </ion-content>
    `
})
export class PopoverMenuEventComponent {

    @Input()
    public onClick = (item: 'freeMovement' | 'openDetails') => {}

}
