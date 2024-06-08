import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `    <div class="progress-container">
  <div class="progress-circle">
    <div class="progress-circle-inner">
      <span>{{ progress }}%</span>
    </div>
  </div>
</div>`,
  styleUrls: [ './progress-indicator.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressIndicatorComponent implements OnChanges{


  @Input() progress: number = 0;
  conicGradient: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['progress']) {
      this.updateConicGradient();
    }
  }

  updateConicGradient() {
    const progressDegree = (this.progress / 100) * 360;
    this.conicGradient = `conic-gradient(green ${progressDegree}deg, lightgray ${progressDegree}deg)`;
    const progressCircle = document.querySelector('.progress-circle') as HTMLElement;
    if (progressCircle) {
      progressCircle.style.background = this.conicGradient;
    }
  }

 }
