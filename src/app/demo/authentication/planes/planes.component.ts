// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule, SharedModule,RouterModule],
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export default class PlanesComponent implements OnInit {
  Planes:any=[]
  constructor(private conS:ConfigurationService) {}

  ngOnInit(): void {
  this.conS.obtenerPlanes().subscribe(resp=>{
    this.Planes=resp
    console.log('Planes',this.Planes)
  })
  }


}
