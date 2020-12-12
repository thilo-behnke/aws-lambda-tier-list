import { Component, OnInit, ViewChildren } from '@angular/core';
import { TierService } from '../../services/tier.service';
import { Tier } from '../../models/tier.model';
import { TierObjectService } from '../../services/tier-object.service';
import { forkJoin, of, throwError } from 'rxjs';
import { TierObject } from '../../models/tier-object.model';
import { DragTierObjectService } from '../../services/drag-tier-object.service';
import { TierListRowComponent } from './tier-list-row.component';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tier-list',
  styleUrls: ['./tier-list.component.scss'],
  template: `
    <div class="tier-grid" [class.tier-grid--updated]="!!wasUpdated">
      <ng-container *ngIf="tiers && tierObjects; else loading">
        <ng-container *ngFor="let tier of tiers">
          <app-tier-list-row
            [tier]="tier"
            [tierObjects]="getObjectsForTier(tier.id)"
          ></app-tier-list-row>
        </ng-container>
        <app-tier-list-row
          [tier]="UNCATEGORIZED_TIER"
          [tierObjects]="getObjectsForTier(UNCATEGORIZED_TIER.id)"
        ></app-tier-list-row>
      </ng-container>
    </div>
    <ng-template #loading> ...loading...</ng-template>
  `,
})
export class TierListComponent implements OnInit {
  public tiers!: Tier[];
  public tierObjects!: TierObject[];
  public wasUpdated = false;

  @ViewChildren(TierListRowComponent) tierListRows!: TierListRowComponent[];

  public readonly UNCATEGORIZED_TIER = { id: undefined, name: 'UNCATEGORIZED' };

  constructor(
    private tierService: TierService,
    private tierObjectService: TierObjectService,
    private dragTierObjectService: DragTierObjectService
  ) {}

  ngOnInit() {
    this.tierService.getTiers().subscribe((tiers) => {
      this.tiers = tiers.sort(
        (a, b) => parseInt(a.id as string, 10) - parseInt(b.id as string, 10)
      );
    });

    this.tierObjectService.getTierObjects().subscribe((tierObjects) => {
      this.tierObjects = tierObjects;
    });

    this.dragTierObjectService.dragStart$
      .pipe(
        tap(() => {
          this.wasUpdated = false;
        })
      )
      .subscribe();

    this.dragTierObjectService.dragEnd$
      .pipe(
        map(({ y, tierObject }) => {
          const newTierListRow = this.tierListRows.find((row) => {
            const elementRef = row.elementRef;
            const start = elementRef.nativeElement.offsetTop;
            const end = start + elementRef.nativeElement.offsetHeight;
            return y >= start && y <= end;
          });
          if (!newTierListRow) {
            return { ...tierObject };
          }
          const updatedTierObject: TierObject = {
            ...tierObject,
            tierId: newTierListRow.tier.id,
          };
          return updatedTierObject;
        }),
        tap((tierObject) => {
          this.tierObjectService
            .assignTierObjectToTier(tierObject, tierObject.tierId)
            .subscribe();
          this.wasUpdated = true;
        })
      )
      .subscribe();
  }

  getObjectsForTier(tierId?: string) {
    return this.tierObjects.filter(
      ({ tierId: objectTierId }) => objectTierId === tierId
    );
  }
}
