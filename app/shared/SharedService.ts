import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {

    private data = {};

    setOption(option, value) {
       this.data[option] = value;
     }
     getOption() {
       return this.data;
     }
     getvoucherInfo(data) {
      return this.data[data];
    }
     
}