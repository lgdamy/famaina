import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Configurations } from '../configurations';
import { timer } from 'rxjs';
import { Livecam } from '../livecam/livecam';

@Component({
  imports: [MatButtonModule, MatIconModule, TranslatePipe, RouterModule, Livecam],
  selector: 'app-instalive',
  styleUrl: './instalive.scss',
  templateUrl: './instalive.html',
})
export class Instalive {
  private readonly router = inject(Router);
  private readonly configurations = inject(Configurations);
  readonly compactNumber = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  });

  username: string = this.configurations.username;
  viewCount = signal(100)
  
  ngOnInit(): void {
    timer(0,2000).subscribe(() => this.viewCount.update(count => count+= Math.round(Math.random() * 10)))
  }

  encerrar() {
    this.router.navigate(['']);
  }

  incrementViewCount() {
    this.viewCount.update((count => count+= Math.round(Math.random() * 50)))
  }
}
