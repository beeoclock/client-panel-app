import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	signal,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonLabel, IonSelect, IonSelectOption} from "@ionic/angular/standalone";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IProductTag} from "@tenant/product/product-tag/domain";

@Component({
    selector: 'ion-select-product-tag',
    standalone: true,
    template: `
        <ion-select
                [formControl]="control()"
                [multiple]="multiple()"
                [placeholder]="placeholderTranslateKey() | translate"
                class="!min-h-0 px-4 py-3 border border-beeColor-300 rounded-2xl h-full"
                fill="solid"
                interface="popover">
            @for (productTag of productTagList(); track productTag._id) {
                <ion-select-option [value]="productTag.name">
                    <ion-label>{{ productTag.name }}</ion-label>
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
export class IonSelectServiceComponent {

    public readonly ionSelect = viewChild(IonSelect);

    public readonly multiple = input(true);

    public readonly placeholderTranslateKey = input('keyword.capitalize.allTags');

    public readonly id = input('');

    public readonly control = input.required<FormControl>();

    private readonly sharedUow = inject(SharedUow);

    public readonly productTagList = signal<IProductTag.EntityRaw[]>([]);

    public constructor() {

		afterNextRender(() => {

			this.sharedUow.productTag.repository.findAsync().then((response) => {
				const {items} = response;
				this.productTagList.set(items);
			});

		});

	}


}
