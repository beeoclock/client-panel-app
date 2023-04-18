import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import * as Utility from '@utility/domain';
import {Notification} from '@utility/notification';
import {inject} from '@angular/core';
import {EventFormRepository} from '@event/repository/event.form.repository';


export interface IAttendeesCreateForm {
  email: FormControl<string | null>;

  [key: string]: AbstractControl<any, any>;
}

export interface IEventForm {
  id: FormControl<string>;
  title: FormControl<string>;
  services: FormControl<string[]>;
  description: FormControl<string>;
  start: FormControl<string | null>;
  end: FormControl<string | null>;
  attendees: FormArray<FormGroup>;
  languageCodes: FormControl<Utility.Enum.LanguageCodeEnum[] | null>;

  [key: string]: AbstractControl<any, any>;
}

export class EventForm extends FormGroup<IEventForm> {

  public readonly languages: {
    code: Utility.Enum.LanguageCodeEnum;
    name: string;
  }[] = [
    {
      code: Utility.Enum.LanguageCodeEnum.en,
      name: 'English'
    },
    {
      code: Utility.Enum.LanguageCodeEnum.uk,
      name: 'Українська'
    },
    {
      code: Utility.Enum.LanguageCodeEnum.pl,
      name: 'Polski'
    },
  ];
  private readonly eventFormAdapt: EventFormRepository = inject(EventFormRepository);

  constructor() {
    super({
      id: new FormControl(),
      description: new FormControl(),
      end: new FormControl((new Date()).toISOString(), [Validators.required]),
      start: new FormControl((new Date()).toISOString(), [Validators.required]),
      services: new FormControl(),
      title: new FormControl(),
      attendees: new FormArray<FormGroup<IAttendeesCreateForm>>([
        new AttendeeCreateForm()
      ], [Validators.minLength(1)]),
      languageCodes: new FormControl<Utility.Enum.LanguageCodeEnum[] | null>([Utility.Enum.LanguageCodeEnum.en])
    });
  }

  public async save(): Promise<void> {
    this.markAllAsTouched();
    if (this.valid) {
      const {id, ...value} = this.value;
      await this.eventFormAdapt.save(value, id);
      Notification.push(new Notification('success'));
    }
  }
}

export class AttendeeCreateForm extends FormGroup<IAttendeesCreateForm> {
  constructor() {
    super({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }
}
