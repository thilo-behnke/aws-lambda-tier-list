import { Injectable } from '@angular/core';
import { Tier } from '../models/tier.model';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export abstract class TierService {
  abstract createTier(tierName: string): Observable<Tier>;
  abstract removeTier(tierId: string): Observable<void>;
  abstract getTiers(): Observable<Tier[]>;
}

@Injectable()
export class InMemoryTierService implements TierService {
  private tiers: Tier[] = [];
  private idCounter = 1;

  createTier(tierName: string): Observable<Tier> {
    const tier = { id: this.idCounter.toString(), name: tierName };
    this.tiers.push();
    return of(tier);
  }

  getTiers(): Observable<Tier[]> {
    return of(this.tiers);
  }

  removeTier(tierId: string): Observable<void> {
    this.tiers = this.tiers.filter(({ id }) => id !== tierId);
    return of();
  }
}

@Injectable()
export class StaticTierService implements TierService {
  private tiers: Tier[] = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
    { id: '3', name: 'C' },
    { id: '4', name: 'D' },
  ];
  private idCounter = 1;

  createTier(tierName: string): Observable<Tier> {
    return of();
  }

  getTiers(): Observable<Tier[]> {
    return of(this.tiers);
  }

  removeTier(tierId: string): Observable<void> {
    return of();
  }
}

@Injectable()
export class HttpTierService extends StaticTierService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  getTiers(): Observable<Tier[]> {
    return this.httpClient.get<Tier[]>('/api/tiers');
  }
}
