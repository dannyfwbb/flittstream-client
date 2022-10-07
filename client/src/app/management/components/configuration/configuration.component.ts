import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fsc-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  constructor() { }

  publicRegistration: boolean;
  enabledByDefault: boolean;
  requireConfirmedEmail: boolean;

  ngOnInit() {
  }

}
