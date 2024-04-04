import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';

@NgModule({
  providers: [MessageService] // Provide MessageService here
})
export class SharedModule {}
