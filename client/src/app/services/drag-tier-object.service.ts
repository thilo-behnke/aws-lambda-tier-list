import { Observable, Subject } from 'rxjs';
import { TierObject } from '../models/tier-object.model';
import { Tier } from '../models/tier.model';

export abstract class DragTierObjectService {
  abstract get dragStart$(): Observable<void>;
  abstract get dragEnd$(): Observable<{
    x: number;
    y: number;
    tierObject: TierObject;
  }>;
  abstract notifyDragEnd(tierObject: TierObject, x: number, y: number): void;
  abstract notifyDragStart(): void;
}

export class DefaultDragTierObjectService implements DragTierObjectService {
  private dragStartSubject = new Subject<void>();
  private dragEndSubject = new Subject<{
    x: number;
    y: number;
    tierObject: TierObject;
  }>();

  get dragStart$(): Observable<void> {
    return this.dragStartSubject.asObservable();
  }

  get dragEnd$(): Observable<{ x: number; y: number; tierObject: TierObject }> {
    return this.dragEndSubject.asObservable();
  }

  notifyDragEnd(tierObject: TierObject, x: number, y: number): void {
    this.dragEndSubject.next({ x, y, tierObject });
  }

  notifyDragStart() {
    this.dragStartSubject.next();
  }
}
