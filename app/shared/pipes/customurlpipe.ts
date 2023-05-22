import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customurl' })
export class Customurl implements PipeTransform {
    transform(title: string) {
        const urlSlug = title.trim().toLowerCase().replace(/ /g, '-');
        return urlSlug;
    }
}
