import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { MomentDateAdapter } from '../helpers/momentDateAdapter';

@Pipe({ name: 'dateFormat' })
export class MomentDateTimePipe implements PipeTransform {
  constructor(private adapter: MomentDateAdapter) {
    //
  }

  transform(value: Date | moment.Moment): string {
    return this.adapter.formatForView(value);
  }
}
