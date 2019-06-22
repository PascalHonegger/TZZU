import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TzzuCreatorComponent } from './tzzu-creator/tzzu-creator.component';
import { LessonCreatorComponent } from './lesson-creator/lesson-creator.component';

const routes: Routes = [
   {
     path: '',
     pathMatch: 'full',
     redirectTo: '/lektionsplan'
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
