import { Component } from '@angular/core';

@Component({
  selector: 'fsc-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {

  publicRegistration: boolean;
  enabledByDefault: boolean;
  requireConfirmedEmail: boolean;
}
