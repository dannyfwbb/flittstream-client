import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from '../../../../shared/bases/base.component';

@Component({
  selector: 'fsc-artist-editor',
  templateUrl: './artist-editor.component.html',
  styleUrls: ['./artist-editor.component.scss']
})
export class ArtistEditorComponent extends BaseComponent implements OnInit {
  @ViewChild('form', { static: true }) private form: NgForm;

  constructor(
    private config: DynamicDialogConfig,
    private formBuilder: UntypedFormBuilder,
    private ref: DynamicDialogRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    super();
    this.buildForm();
  }

  artistForm: UntypedFormGroup;
  loading = false;

  ngOnInit() {
    this.loadData();
  }

  get name() {
    return this.artistForm.get('name');
  }

  get description() {
    return this.artistForm.get('description');
  }

  buildForm(): void {
    this.artistForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: '',
    });
  }

  loadData(): void {
    //
  }

  save(): void {
    //
  }
}
