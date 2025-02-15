import {ChangeDetectionStrategy, Component, HostBinding, input, ViewEncapsulation} from "@angular/core";
import {RIMember} from "@src/core/business-logic/member";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-selected-member-additional-menu',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    template: `
        <div class="text-beeColor-400 flex justify-between text-sm">
            <div>
                {{ 'keyword.capitalize.selectedMember' | translate }}
            </div>
            <!--            <div>-->
            <!--                #{{ member._id }}-->
            <!--            </div>-->
        </div>
        <div class="text-beeColor-500">{{ member().firstName }}&nbsp;{{ member().lastName }}</div>
    `,
    imports: [
        TranslateModule
    ]
})
export class SelectedMemberAdditionalMenuComponent {

    public readonly member = input.required<RIMember>();

    @HostBinding()
    public get class() {
        return 'bg-white border border-beeColor-300 flex flex-col p-2 rounded-xl';
    }

}
