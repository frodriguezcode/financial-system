import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="progress-container">
    <div class="progress-circle animate__animated" [style.background]="conicGradient">
      <div class="progress-circle-inner">
        <span>{{ progress }}%</span>
      </div>
    </div>
  </div>`,
  styleUrls: ['./progress-indicator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressIndicatorComponent implements OnChanges {
  @Input() progress: number = 0;
  conicGradient: string = '';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['progress']) {
      // this.updateConicGradient();
      this.animateProgress();
    }
  }

  animateProgress() {
    const progressCircle = this.el.nativeElement.querySelector('.progress-circle');
    this.renderer.removeClass(progressCircle, 'animate__fadeIn');
    this.renderer.addClass(progressCircle, 'animate__fadeIn');
    setTimeout(() => {
      this.updateConicGradient();
      this.renderer.removeClass(progressCircle, 'animate__fadeOut');
      this.renderer.addClass(progressCircle, 'animate__fadeIn');
    }, 500); // Duración de la animación fadeOut
  }

  updateConicGradient() {
    const progressDegree = (this.progress / 100) * 360;
    this.conicGradient = `conic-gradient(green ${progressDegree}deg, lightgray ${progressDegree}deg)`;
    const progressCircle = this.el.nativeElement.querySelector('.progress-circle');
    progressCircle.style.background = this.conicGradient;
  }
}
