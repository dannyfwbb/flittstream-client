import { Routes } from '@angular/router';
import { ExploreComponent } from './components/explore/explore.component';
import { SearchComponent } from './components/search/search.component';

export const CORE_ROUTES: Routes = [
  {
    path: '',
    component: ExploreComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  }
];
