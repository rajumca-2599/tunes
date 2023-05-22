import { Component, OnInit,Input } from '@angular/core';
import { EnvService } from '../env.service';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input() public enableloader: boolean;
  constructor(public env: EnvService,) { }

  ngOnInit(): void {
  }

}
