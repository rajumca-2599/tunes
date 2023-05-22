import { Pipe, PipeTransform } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { enGB } from 'date-fns/locale'
import { id } from 'date-fns/locale'
import { format } from 'date-fns';

@Pipe({
  name: 'convertDate'
})
export class ConvertDate implements PipeTransform {
  constructor(public _translateSrvc: TranslateService) {}
      transform(value: string) {


let formatter: string = this._translateSrvc.currentLang === 'ID' ? 'EE, d MMM y H:mm  zzzz' : 'EE, d MMM y H:mm  zzzz';
let localeLang = this._translateSrvc.currentLang === 'ID' ? id : enGB;
let resultDate = format(new Date(value), 'EE, d MMM y H:mm  zzzz', {locale: localeLang});

this._translateSrvc.onLangChange.subscribe((event: LangChangeEvent) => {
       localeLang = this._translateSrvc.currentLang === 'fr' ? id : enGB;
       resultDate = format(new Date(value), 'EE, d MMM y H:mm  zzzz', {locale: localeLang});
     
    });


     return resultDate;
    }
}
