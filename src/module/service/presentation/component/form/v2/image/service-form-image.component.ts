import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {file2base64} from "@utility/domain/file2base64";
import {TranslateModule} from "@ngx-translate/core";
import {extractFile} from "@utility/domain/extract-file";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'service-form-image-component',
  standalone: true,
  template: `
    <div class="flex">
      <div class="min-w-[128px] max-w-[128px] min-h-[128px] max-h-[128px] rounded-2xl bg-beeColor-400">
        <img *ngIf="previewImage" [src]="previewImage" class="object-cover rounded-2xl min-w-[128px] max-w-[128px] min-h-[128px] max-h-[128px]" alt="Uploaded Image"/>
      </div>
      <div class="flex flex-col ml-2">
        <div>
          <input type="file" #fileInput hidden (change)="onFileSelected($event)" accept="image/*"/>
          <button class="border border-beeColor-200 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-700 dark:text-white rounded-2xl px-4 py-2 cursor-pointer" (click)="fileInput.click()">{{ 'keyword.capitalize.chooseImage' | translate }}</button>
        </div>
        <div class="py-2">
          {{ uploadedFileName }}
        </div>
      </div>
    </div>
  `,
  imports: [
    NgIf,
    TranslateModule
  ]
})
export class ServiceFormImageComponent implements OnInit {

  @ViewChild('fileInput')
  public readonly fileInput!: ElementRef<HTMLInputElement>;

  @Input()
  public control = new FormControl();

  previewImage: string | null = null;
  uploadedFileName: string | null = null;

  public ngOnInit(): void {
    this.control.valueChanges.subscribe((value: string) => {
      this.previewImage = value;
    });
  }

  public async onFileSelected(event: Event): Promise<void> {

    try {

      const fileInput = event.target as HTMLInputElement;
      const file = extractFile(fileInput);
      this.uploadedFileName = file.name;
      const base64 = await file2base64(file);
      this.previewImage = base64;

      this.control.patchValue(base64);

    } catch (e) {
      console.error(e);
    }

  }

}
