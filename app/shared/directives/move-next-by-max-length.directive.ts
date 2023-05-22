import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMoveNextByMaxLength]'
})
export class MoveNextByMaxLengthDirective {

  constructor(private _el: ElementRef) { }

@HostListener('keyup', ['$event']) onKeyDown(e: any) {
    if (e.srcElement.maxLength === e.srcElement.value.length) {

        e.preventDefault();

        let nextControl: any = e.srcElement.nextElementSibling;
       // Searching for next similar control to set it focus
        while (true)
        {
            if (nextControl)
            {
                if (nextControl.type === e.srcElement.type)
                {
                    nextControl.focus();
                    return;
                }
                else
                {
                    nextControl = nextControl.nextElementSibling;
                }
            }
            else
            {
                return;
            }
        }
    }
}

}
