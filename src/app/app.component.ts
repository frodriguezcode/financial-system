// Angular Import
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // constructor
  constructor(private router: Router, private authS:AuthService) {}

  // life cycle event
  ngOnInit() {
  const expirado=this.authS.isTokenExpired()
  if ( expirado) {
    this.router.navigate(['auth/signin']);
    return;
  }

  console.log('expirado',expirado)

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  
}
