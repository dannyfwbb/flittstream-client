import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MomentDateAdapter {
  public valueFromMoment(value: moment.MomentInput): string {
    let result: moment.Moment;
    if (moment.isMoment(value)) {
      result = value.clone();
    } else {
      result = moment(value);
    }
    return result.utc(true).utcOffset(0).format();
  }

  public formatForView(value: moment.MomentInput): string {
    return moment.utc(value, true).local().format('DD.MM.YYYY HH:mm:ss');
  }

  public currentValueFromMoment(): string {
    return moment().utc(true).utcOffset(0).format();
  }

  public momentFromValue(value: moment.MomentInput): moment.Moment {
    return moment(value).utc(true).utcOffset(0);
  }

  public utcFromString(value: string): moment.Moment {
    return this.localFromString(value)?.utc();
  }

  public localFromString(value?: string): moment.Moment {
    return value ? moment(value, true) : null;
  }
}
