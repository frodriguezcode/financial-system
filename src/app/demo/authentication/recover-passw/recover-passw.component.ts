import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule,Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-recover-passw',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './recover-passw.component.html',
  styleUrls: ['./recover-passw.component.scss']
})
export default class RecoverPassw implements OnInit {
  constructor(private autS:AuthService,private readonly router: Router,private conS:ConfigurationService){}
  Usuario:FormControl=new FormControl('');
  Password:FormControl=new FormControl('');
  Empresas:any=[]
ngOnInit(): void {
  localStorage.removeItem('AtributosUsuarioFinancial_System');
  localStorage.removeItem('usuarioFinancialSystems');
}
 


 
 

}
