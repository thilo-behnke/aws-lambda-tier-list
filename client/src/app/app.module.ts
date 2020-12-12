import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TierListComponent } from './components/tier-list/tier-list.component';
import { HttpTierService, TierService } from './services/tier.service';
import {
  HttpTierObjectService,
  TierObjectService,
} from './services/tier-object.service';
import { TierListRowComponent } from './components/tier-list/tier-list-row.component';
import { TierObjectComponent } from './components/tier-object/tier-object.component';
import {
  DefaultDragTierObjectService,
  DragTierObjectService,
} from './services/drag-tier-object.service';
import { HttpClientModule } from '@angular/common/http';
import { CreateTierObjectFormComponent } from './components/create-tier-object/create-tier-object-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    TierListComponent,
    TierListRowComponent,
    TierObjectComponent,
    CreateTierObjectFormComponent,
  ],
  imports: [HttpClientModule, BrowserModule, ReactiveFormsModule, NgbModule],
  providers: [
    { provide: TierService, useClass: HttpTierService },
    { provide: TierObjectService, useClass: HttpTierObjectService },
    { provide: DragTierObjectService, useClass: DefaultDragTierObjectService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
