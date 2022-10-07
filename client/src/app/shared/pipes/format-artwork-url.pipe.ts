import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatArtworkUrl'
})
export class FormatArtworkUrlPipe implements PipeTransform {

  transform( artworkUrl: string, _desiredDimension: number ): string {
    if ( !artworkUrl ) {
      return './assets/default.jpeg';
    }
    return artworkUrl;
  }

}
