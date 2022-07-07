import { Component, Input } from '@angular/core';
import { ArtistModel } from '../../../models/artist-model';

@Component({
  selector: 'fsc-artist-preview',
  templateUrl: './artist-preview.component.html',
  styleUrls: ['./artist-preview.component.scss']
})
export class ArtistPreviewComponent {
  @Input() artistData: ArtistModel;
}
