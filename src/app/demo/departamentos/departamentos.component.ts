// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'departamentos-page',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export default class DepartamentosPageComponent implements OnInit{

  departamentos: any [] = [];
  


  constructor(){

  }


  ngOnInit(): void {

  }
}
