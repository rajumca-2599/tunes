import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
@Pipe({
  name: 'amountConverter',
})
export class AmountConverterPipe extends DecimalPipe {
  transform(input: any, args?: any): any {
    console.log(input);
    if (input < 0) {
      input = -input;
    }
    if (input <= 999) {
      return Number(input);
    } else if (input >= 1000 && input <= 9999999) {
      // thousands
      var amount = super.transform(input, args).replace(',', '.');
      amount = amount.replace(',', '.');
      return amount;
    //  return super.transform(input, args).replace(',', '.');
    } else if (input >= 10000000) {
      // millions //biilions
      // console.log(input + '|' + super.transform(input, args).replace(',', '.'));
      let exp;
      const suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];
      const isNagtiveValues = input < 0;
      if (
        Number.isNaN(input) ||
        (input < 1000 && input >= 0) ||
        !this.isNumeric(input) ||
        (input < 0 && input > -1000)
      ) {
        if (!!args && this.isNumeric(input) && !(input < 0) && input != 0) {
          return input.toFixed(args);
        } else {
          return input;
        }
      }

      if (!isNagtiveValues) {
        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (input / Math.pow(1000, exp)).toFixed(3) + suffixes[exp - 1];
      } else {
        input = input * -1;

        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (
          ((input * -1) / Math.pow(1000, exp)).toFixed(3) + suffixes[exp - 1]
        );
      }
    }
  }
  transformAmount(input: any, args?: any): any {
    console.log(input);
    if (input < 0) {
      input = -input;
    }
    //console.log(input);
    if (input <= 999) {
      return Number(input);
    } else if (input >= 1000 && input <= 9999999) {
      // thousands
      return super.transform(input, args).replace(',', '.');
    } else if (input >= 10000000) {
      // millions //biilions
      // console.log(input + '|' + super.transform(input, args).replace(',', '.'));
      let exp;
      const suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];
      const isNagtiveValues = input < 0;
      if (
        Number.isNaN(input) ||
        (input < 1000 && input >= 0) ||
        !this.isNumeric(input) ||
        (input < 0 && input > -1000)
      ) {
        if (!!args && this.isNumeric(input) && !(input < 0) && input != 0) {
          return input.toFixed(args);
        } else {
          return input;
        }
      }

      if (!isNagtiveValues) {
        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (input / Math.pow(1000, exp)).toFixed(3) + suffixes[exp - 1];
      } else {
        input = input * -1;

        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (
          ((input * -1) / Math.pow(1000, exp)).toFixed(3) + suffixes[exp - 1]
        );
      }
    }
  }
  isNumeric(value): boolean {
    if (value < 0) value = value * -1;
    if (/^-{0,1}\d+$/.test(value)) {
      return true;
    } else if (/^\d+\.\d+$/.test(value)) {
      return true;
    } else {
      return false;
    }
  }
}
