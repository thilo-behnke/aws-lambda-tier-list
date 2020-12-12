import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TierObject } from '../models/tier-object.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export abstract class TierObjectService {
  abstract createTierObject(name: string): Observable<TierObject>;

  abstract getTierObjects(): Observable<TierObject[]>;

  abstract assignTierObjectToTier(
    tierObject: TierObject,
    tierId?: string
  ): Observable<void>;
}

@Injectable()
export class HttpTierObjectService implements TierObjectService {
  private tierObjectSubject = new BehaviorSubject<TierObject[]>([]);

  constructor(private httpClient: HttpClient) {}

  createTierObject(name: string): Observable<TierObject> {
    return this.httpClient
      .post<TierObject>('/api/tier-objects', { name })
      .pipe(
        tap((tierObject) => {
          this.tierObjectSubject.next([
            ...this.tierObjectSubject.getValue(),
            tierObject,
          ]);
        })
      );
  }

  // Optimistic approach! Don't wait for response, just reassign the tier id in the client. Otherwise the UI feels sluggish.
  // TODO: A better alternative would be to save all assignments in intervals.
  assignTierObjectToTier(
    tierObject: TierObject,
    tierId: string
  ): Observable<void> {
    const currentTierObjects = this.tierObjectSubject.getValue();
    const newTierObjects = currentTierObjects.map((obj) => {
      if (obj.id === tierObject.id) {
        return { ...tierObject, tierId };
      }
      return obj;
    });
    this.tierObjectSubject.next(newTierObjects);

    if (
      tierObject.tierId !==
      currentTierObjects.find(({ id }) => id === tierObject.id)?.tierId
    ) {
      return this.httpClient.patch<void>(
        `/api/tier-objects/${tierObject.id}/set-tier-id`,
        { id: tierObject.id, tierId }
      );
    } else {
      return of();
    }
  }

  getTierObjects(): Observable<TierObject[]> {
    this.httpClient
      .get<TierObject[]>('/api/tier-objects')
      .subscribe((tierObjects) => this.tierObjectSubject.next(tierObjects));
    return this.tierObjectSubject.asObservable();
  }
}
