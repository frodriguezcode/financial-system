// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export default class LoaderComponent {}
