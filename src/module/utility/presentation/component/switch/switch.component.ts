import {Component, input, OnChanges, OnInit, SimpleChange, SimpleChanges} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {Reactive} from "@src/module/utility/cdk/reactive";
import {ActiveEnum} from "src/core/shared/enum";
import {filter} from "rxjs";
import {is} from "@src/core/shared/checker";

@Component({
    selector: 'utility-switch-component',
    standalone: true,
    template: `
        <label class="relative inline-flex items-center justify-between cursor-pointer w-full">
        <span
                class="mr-3 text-sm font-medium text-beeColor-900 dark:text-beeDarkColor-300">
          {{ label() ?? (labelTranslateKey() | translate) }}
        </span>
            <input [id]="id()" type="checkbox" [formControl]="localControl" class="sr-only peer">
            <div class="
				relative
				min-w-11
				max-w-11
				min-h-6
				max-h-6
				bg-beeColor-200
				peer-focus:outline-none
				peer-focus:ring-4
				peer-focus:ring-blue-300
				dark:peer-focus:ring-blue-800
				rounded-full
				peer
				dark:bg-beeDarkColor-700
				peer-checked:after:translate-x-full
				peer-checked:after:border-white
				after:content-['']
				after:absolute
				after:top-[2px]
				after:right-[22px]
				after:bg-white
				after:border-beeColor-300
				after:border
				after:rounded-full
				after:h-5
				after:w-5
				after:transition-all
				dark:border-beeDarkColor-600
				peer-checked:bg-blue-600">
            </div>
        </label>
    `,
    imports: [
        ReactiveFormsModule,
        TranslateModule,
    ]
})
export class SwitchComponent extends Reactive implements OnInit, OnChanges {

    public readonly label = input<unknown | string>();

    public readonly labelTranslateKey = input('keyword.capitalize.active');

    public readonly id = input('');

    public readonly booleanValue = input(false);

    public readonly units = input<unknown[]>([ActiveEnum.NO, ActiveEnum.YES]);

    public readonly control = input(new FormControl()); // External control

    public readonly localControl = new FormControl();

    public ngOnChanges(changes: SimpleChanges & { control: SimpleChange }) {

        if (changes.control) {

            const control = changes.control.currentValue as FormControl;
            if (this.booleanValue()) {
                this.localControl.setValue(control.value);
            } else {
                this.localControl.setValue(this.units().indexOf(control.value) === 1);
            }
            control.valueChanges.pipe(
                this.takeUntil(),
                filter((value) => {
                    if (this.booleanValue()) {
                        return this.localControl.value !== value;
                    }
                    return this.units()[Number(this.localControl.value)] !== value;
                })
            ).subscribe((value) => {
                if (this.booleanValue()) {
                    this.localControl.setValue(value);
                    return;
                }
                this.localControl.setValue(this.units().indexOf(value) === 1);
            });

        }

    }

    public ngOnInit(): void {

        this.localControl.valueChanges.pipe(
            this.takeUntil(),
            filter(is.boolean),
        ).subscribe((value) => {
            if (this.booleanValue()) {
                this.control().setValue(value);
                return;
            }
            this.control().setValue(
                value ? this.units()[1] : this.units()[0],
            );
        });

    }

}
