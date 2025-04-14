// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import ManagerRecapMensualComponent from './manager-recap-mensual/manager-recap-mensual.component';

@Component({
  selector: 'app-manager-recap-admin',
  standalone: true,
  imports: [CommonModule, SharedModule,ManagerRecapMensualComponent],
  templateUrl: './manager-recap-admin.component.html',
  styleUrls: ['./manager-recap-admin.component.scss']
})
export default class ManagerRecaptAdminComponent {}
