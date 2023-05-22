import { Pipe, PipeTransform } from '@angular/core';
import { months } from 'moment';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {
newmonthvalue:any
engmonth:any;
    transform(value: string): string {
     let  monthsarr=[
        {
        idmonth:"januari",engmonth:"January"
        },
      {
        idmonth:"Februari", engmonth:"february"
      },
      {
        idmonth:"Maret", engmonth:"march"
      },
      {
        idmonth:"April", engmonth:"april"
      },{
        idmonth:"Mei", engmonth:"may"
      },
      {
        idmonth:"Juni", engmonth:"june"
      },
      {
        idmonth:"Juli", engmonth:"july"
      },
      {
        idmonth:"Agustus", engmonth:"august"
      },
      {
        idmonth:"september", engmonth:"september"
      },
      {
        idmonth:"oktober", engmonth:"october"
      
      },
      {
        idmonth:"november", engmonth:"November"
       
      },
      {
        idmonth:"Desember", engmonth:"december"
      }]
      let newvalue=value.split(" ")  
    for(let i=0;i<monthsarr.length;i++){
      if(monthsarr[i].engmonth==newvalue[1].toLowerCase()){
        this.newmonthvalue=monthsarr[i].idmonth
        this.engmonth=monthsarr[i].engmonth.toLowerCase()
      }
    }
   
      if (value) {
        let newvalue1=value.split(" ")
          if (newvalue1[1].toLowerCase() === this.engmonth) {
            let nvalue=value.split(" ")
            nvalue[1]=this.newmonthvalue
            value=nvalue.join(" ")
            
              console.log(value)          
          }        
          return value;
      }
  }
  }


