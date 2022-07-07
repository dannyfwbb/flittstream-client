import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../shared/bases/base.component';
import { DialogResult } from '../../../shared/models/dialog/dialogResult';
import { ArtistModel } from '../../models/artist-model';
import { ArtistEditorComponent } from './artist-editor/artist-editor.component';

@Component({
  selector: 'fsc-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
  providers: [DialogService]
})
export class ArtistsComponent extends BaseComponent implements OnInit {

  constructor(
    private dialogService: DialogService,
  ){
    super();
  }

  artists: ArtistModel[];

  ngOnInit(): void {
    this.artists = [
      {
        id: 'iddd',
        name: 'Nomy'
      } as ArtistModel,
      {
        id: 'iooo',
        name: 'Bad Omens'
      } as ArtistModel
    ];
  }

  addArtist(): void {
    const ref = this.dialogService.open(ArtistEditorComponent, {
      header: 'Add new artist',
      width: '30%',
      height: '85%',
    });

    ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: ((result) => {
        if (!result) return;

        switch (result.result) {
          case DialogResult.Applied:
            //this.tableHelper.records.push(result.data);
            break;
        }
      })
    });
  }

  filter(_$event: Event): void {
    //
  }
}
