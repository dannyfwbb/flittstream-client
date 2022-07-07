import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SharedPrimengModule } from '../shared/submodule/primeng.module';
import { AlbumsComponent } from './components/albums/albums.component';
import { ArtistEditorComponent } from './components/artists/artist-editor/artist-editor.component';
import { ArtistPreviewComponent } from './components/artists/artist-preview/artist-preview.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecentlyListenedComponent } from './components/recently-listened/recently-listened.component';
import { SearchComponent } from './components/search/search.component';
import { SongsComponent } from './components/songs/songs.component';
import { CORE_ROUTES } from './core.routes';

const COMPONENTS = [
  ExploreComponent,
  SearchComponent,
  AlbumsComponent,
  SongsComponent,
  RecentlyListenedComponent,
  ProfileComponent,

  ArtistsComponent,
  ArtistEditorComponent,
  ArtistPreviewComponent,

  AlbumsComponent,
];

@NgModule({
  imports: [
    SharedModule,
    SharedPrimengModule,
    CommonModule,
    RouterModule.forChild(CORE_ROUTES),
  ],
  declarations: [COMPONENTS]
})
export class CoreModule { }
