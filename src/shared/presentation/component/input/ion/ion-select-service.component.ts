import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnInit,
	signal,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonLabel, IonSelect, IonSelectOption} from "@ionic/angular/standalone";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IService} from "@tenant/service/domain/interface/i.service";

@Component({
    selector: 'ion-select-service',
    standalone: true,
    template: `
        <ion-select
                [formControl]="control()"
                [multiple]="multiple()"
                [placeholder]="placeholderTranslateKey() | translate"
                class="!min-h-0 px-4 py-3 border border-beeColor-300 rounded-2xl h-full"
                fill="solid"
                interface="popover">
            @for (service of services(); track service._id) {
                <ion-select-option [value]="service._id">
                    <ion-label>{{ service.languageVersions[0].title }}</ion-label>
                </ion-select-option>
            }
        </ion-select>
    `,
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgSelectModule,
        ReactiveFormsModule,
        TranslateModule,
        IonSelect,
        IonSelectOption,
        IonLabel,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectServiceComponent implements OnInit {

    public readonly ionSelect = viewChild(IonSelect);

    public readonly multiple = input(true);

    public readonly placeholderTranslateKey = input('keyword.capitalize.allServices');

    public readonly id = input('');

    public readonly control = input.required<FormControl>();

    private readonly sharedUow = inject(SharedUow);

    public readonly services = signal<IService.EntityRaw[]>([]);

    public ngOnInit() {
        this.sharedUow.service.repository.findAsync().then((response) => {
            const {items} = response;
            this.services.set(items);
        })
    }


}
