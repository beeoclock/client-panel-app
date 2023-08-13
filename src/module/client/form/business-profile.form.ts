import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {file2base64} from "@utility/domain/file2base64";
import {SocialNetworksForm} from "@client/form/social-network.form";
import {extractFile} from "@utility/domain/extract-file";
import {FacilityEnum} from "@utility/domain/enum/facility.enum";
import {BookingSettingsForm} from "@client/form/booking-settings.form";
import {AddressesForm} from "@client/form/address.form";
import {SchedulesForm} from "@utility/form/schdeule.form";
import {ContactsForm} from "@client/form/contact.form";
import {GalleryForm} from "@client/form/gallery.form";


export interface IBusinessProfile {
  _id: FormControl<string>;
  object: FormControl<'Client'>;

  logo: FormControl<string>;
  name: FormControl<string>;
  slogan: FormControl<string>;
  feature: FormControl<string>;
  description: FormControl<string>;
  createdAt: FormControl<string>;
  updatedAt: FormControl<string>;
  active: FormControl<ActiveEnum>;

  socialNetworkLinks: SocialNetworksForm;

  bookingSettings: BookingSettingsForm;
  addresses: AddressesForm;
  schedules: SchedulesForm;
  contacts: ContactsForm;
  gallery: GalleryForm;

  banner: FormControl<string>;
  facilities: FormControl<FacilityEnum[]>;

  [key: string]: AbstractControl<any, any>;
}

export class BusinessProfileForm extends FormGroup<IBusinessProfile> {

  constructor() {
    super({
      _id: new FormControl(),
      object: new FormControl(),

      logo: new FormControl(),
      name: new FormControl(),
      slogan: new FormControl(),
      feature: new FormControl(),
      description: new FormControl(),
      active: new FormControl(),
      createdAt: new FormControl(),
      updatedAt: new FormControl(),
      socialNetworkLinks: new SocialNetworksForm(),

      bookingSettings: new BookingSettingsForm(),
      banner: new FormControl(),
      facilities: new FormControl(),
      addresses: new AddressesForm(),
      schedules: new SchedulesForm(),
      contacts: new ContactsForm(),
      gallery: new GalleryForm(),
    });

    this.initValidators();
    this.initHandles();
    this.initValue();

  }

  private initHandles(): void {
    this.controls.active.valueChanges.subscribe((value) => {
      if (typeof value === 'boolean') {
        this.controls.active.patchValue(+value, {
          emitEvent: false
        });
      }
    })
  }

  private initValue(): void {
    this.controls.object.setValue('Client');
    this.controls.active.setValue(ActiveEnum.NO);
  }

  private initValidators(): void {
    this.controls.name.setValidators([Validators.minLength(1), Validators.required]);
    this.controls.description.setValidators([Validators.maxLength(1000)]);
  }

  public async setLogo(target: HTMLInputElement): Promise<void> {
    const base64 = await file2base64(extractFile(target));
    this.controls.logo.patchValue(base64);
  }
}
