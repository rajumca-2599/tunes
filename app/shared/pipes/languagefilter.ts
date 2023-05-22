import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common.service';

@Pipe({
  name: 'langFilter'
})

export class LangFilterPipe implements PipeTransform {

  constructor(private _service: CommonService) { }

  transform(value: any): any {
    try {
      let userlang: string = JSON.parse(this._service.getSession("oauth")).lang;
      if (userlang != "" && userlang != "en") {
        let langobject: any[] = JSON.parse(this._service.getSession("language_json"));
        let langitem: any[] = langobject.find(x => x["key"] == value);
        if (langitem == null) {
          langitem = langobject.find(x => x["key"] == value.toLowerCase());
        }
        if (langitem != null) {
          return langitem[0]["value"];
        }
      }

    } catch (e) { }
    return value;
  }
}
