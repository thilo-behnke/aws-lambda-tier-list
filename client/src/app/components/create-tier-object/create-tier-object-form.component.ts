import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TierObject } from '../../models/tier-object.model';
import { TierObjectService } from '../../services/tier-object.service';

@Component({
  selector: 'app-create-tier-object-form',
  styleUrls: ['./create-tier-object-form.component.scss'],
  template: `
    <form
      class="tier-object-form"
      [formGroup]="tierObjectForm"
      (ngSubmit)="onSubmit()"
    >
      <div class="form-group">
        <label> Name </label>
        <input
          required
          class="form-control"
          type="text"
          formControlName="name"
        />
      </div>
      <div class="tier-object-form__buttons">
        <button
          [disabled]="loading"
          class="btn btn-secondary"
          type="button"
          (click)="onCancel()"
        >
          Close
        </button>
        <button
          [disabled]="loading"
          class="btn btn-primary d-flex flex-row align-items-center"
          type="submit"
        >
          <span
            *ngIf="loading"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          Create
        </button>
      </div>
    </form>
  `,
})
export class CreateTierObjectFormComponent {
  @Output() dismiss = new EventEmitter<void>();

  public loading = false;

  constructor(private tierObjectService: TierObjectService) {}

  public tierObjectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  public onSubmit() {
    if (this.tierObjectForm.invalid) {
      // TODO: Handle error.
      return;
    }
    this.loading = true;
    this.tierObjectService
      .createTierObject(this.tierObjectForm.value.name)
      .subscribe(() => {
        this.dismiss.next();
      });
  }

  public onCancel() {
    this.dismiss.next();
  }
}
