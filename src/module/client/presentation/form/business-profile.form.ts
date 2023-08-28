import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {file2base64} from "@utility/domain/file2base64";
import {SocialNetworksForm} from "@client/presentation/form/social-network.form";
import {extractFile} from "@utility/domain/extract-file";
import {FacilityEnum} from "@utility/domain/enum/facility.enum";
import {BookingSettingsForm} from "@client/presentation/form/booking-settings.form";
import {AddressesForm} from "@client/presentation/form/address.form";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";
import {ContactsForm} from "@client/presentation/form/contact.form";
import {GalleryForm} from "@client/presentation/form/gallery.form";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";


export interface IBusinessProfile {
  _id: FormControl<string>;
  object: FormControl<'Client'>;

  logo: FormControl<string>;
  name: FormControl<string>;
  businessCategory: FormControl<BusinessCategoryEnum>;
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
      businessCategory: new FormControl(),
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
