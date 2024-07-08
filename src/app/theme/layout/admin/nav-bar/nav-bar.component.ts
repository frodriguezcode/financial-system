// Angular Import
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  // public props
  menuClass = false;
  collapseStyle = 'none';
  windowWidth = window.innerWidth;
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();
  ngOnInit(): void {

    this.navCollapse()
  }
  // public method
  toggleMobOption() {
    this.menuClass = !this.menuClass;
    this.collapseStyle = this.menuClass ? 'block' : 'none';
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.NavCollapse.emit();
    }
  }
}
