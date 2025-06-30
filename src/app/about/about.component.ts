import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [MaterialModule],
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {}