import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeatureChooserComponent } from './feature-chooser/feature-chooser.component';
import { TzzuCreatorComponent } from './tzzu-creator/tzzu-creator.component';
import { LessonCreatorComponent } from './lesson-creator/lesson-creator.component';

const routes: Routes = [
   {
     path: '',
     pathMatch: 'full',
     component: FeatureChooserComponent
   },
   {
     path: 'tzzu',
     component: TzzuCreatorComponent
   },
   {
     path: 'lektionsplan',
     component: LessonCreatorComponent
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
