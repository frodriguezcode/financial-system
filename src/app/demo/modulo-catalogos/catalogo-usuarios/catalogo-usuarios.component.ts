// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-catalogo-usuarios',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './catalogo-usuarios.component.html',
  styleUrls: ['./catalogo-usuarios.component.scss']
})
export default class CatalogoUsuariosComponent implements OnInit {
constructor (private conS:ConfigurationService){}
ngOnInit(): void {
  
}


}
