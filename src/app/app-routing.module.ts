import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './modules/app/app.component';
import { TableBuilderComponent } from './modules/builder/table/builder.table.component';
import { QueryComponent } from './modules/query/query.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: AppComponent },
  { path: 'tablebuilder', component: TableBuilderComponent },
  { path: 'query', component: QueryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
