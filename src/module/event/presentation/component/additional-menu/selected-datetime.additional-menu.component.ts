import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-selected-datetime-additional-menu',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    template: `
        <div class="text-beeColor-400 text-sm">
            {{ 'keyword.capitalize.selectedDateTime' | translate }}
        </div>
        <div class="text-beeColor-500">{{ datetimeISO | dynamicDate }}</div>
    `,
    imports: [
        DynamicDatePipe,
        TranslateModule
    ]
})
export class SelectedDatetimeAdditionalMenuComponent {

    @Input({required: true})
    public datetimeISO!: string;

    @HostBinding()
    public get class() {
        return 'border border-beeColor-300 bg-white rounded-lg p-2 flex flex-col';
    }

}