import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AlbumsComponent } from './components/albums/albums.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { ExploreComponent } from './components/explore/explore.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecentlyListenedComponent } from './components/recently-listened/recently-listened.component';
import { SearchComponent } from './components/search/search.component';
import { SongsComponent } from './components/songs/songs.component';

export const CORE_ROUTES: Routes = [
  {
    path: '',
    component: ExploreComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'artists',
    component: ArtistsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'albums',
    component: AlbumsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'songs',
    component: SongsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'playlists',
    component: PlaylistsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'recently-listened',
    component: RecentlyListenedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }
];
