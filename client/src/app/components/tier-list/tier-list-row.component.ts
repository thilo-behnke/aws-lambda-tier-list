import { Component, ElementRef, Input } from '@angular/core';
import { Tier } from '../../models/tier.model';
import { TierObject } from '../../models/tier-object.model';

@Component({
  selector: 'app-tier-list-row',
  styleUrls: ['./tier-list-row.component.scss'],
  template: `
    <div class="tier-row">
      <div class="tier-row__name">
        {{ tier.name }}
      </div>
      <div class="tier-row__content">
        <ng-container *ngFor="let obj of tierObjects">
          <app-tier-object [tierObject]="obj"></app-tier-object>
        </ng-container>
      </div>
    </div>
  `,
})
export class TierListRowComponent {
  @Input() tier!: Tier;
  @Input() tierObjects!: TierObject[];

  constructor(public elementRef: ElementRef) {}
}
