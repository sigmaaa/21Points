import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppSharedModule } from 'app/shared/shared.module';
import { OthersComponent } from './others.component';
import { OthersDetailComponent } from './others-detail.component';
import { OthersUpdateComponent } from './others-update.component';
import { OthersDeletePopupComponent, OthersDeleteDialogComponent } from './others-delete-dialog.component';
import { othersRoute, othersPopupRoute } from './others.route';

const ENTITY_STATES = [...othersRoute, ...othersPopupRoute];

@NgModule({
  imports: [AppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [OthersComponent, OthersDetailComponent, OthersUpdateComponent, OthersDeleteDialogComponent, OthersDeletePopupComponent],
  entryComponents: [OthersDeleteDialogComponent]
})
export class AppOthersModule {}
