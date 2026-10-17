import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Configurations } from '../configurations';
import { timer } from 'rxjs';
import { Livecam } from '../livecam/livecam';
import { Tracking } from '../tracking';

interface EmojiLike {
  id: number;
  size: number;
  duration: number;
  drift: number;
}

@Component({
  imports: [MatButtonModule, MatIconModule, TranslatePipe, RouterModule, Livecam],
  styleUrl: './instalive.scss',
  templateUrl: './instalive.html',
})
export class Instalive {
  private readonly router = inject(Router);
  private readonly configurations = inject(Configurations);
  private readonly tracking = inject(Tracking);

  readonly likes = signal<EmojiLike[]>([]);
  readonly username: string = this.configurations.username;
  readonly formattedViewCount = computed(() => {
    const count = this.viewCount();
    if (count < 10_000) return count;
    return this.compactNumber.format(count);
  });
  
  
  private readonly compactNumber = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  });
  private viewCount = signal(100);
  
  private nextLikeId = 0;
  
  ngOnInit(): void {
    timer(0,2000).subscribe(() => this.viewCount.update(count => count += Math.round(Math.random() * 10)));
    this.tracking.track('live_started', {'platform':'insta'});
  }

  encerrar() {
    this.tracking.track('live_ended', {'platform':'insta'});
    this.router.navigate(['']);
  }

  updateViewCount(value: number) {
    this.viewCount.update(count => count + value);
  }

  dispatchLike() {
    const id = ++this.nextLikeId;
    const like: EmojiLike = {
      id,
      size: 20 + Math.random() * 20,
      duration: 2.5 + Math.random() * 2,
      drift: -40 + Math.random() * 80
    };
    this.likes.update(current => [...current, like]);
    setTimeout(() => this.likes.update(current => current.filter(item => item.id !== id)), like.duration * 1000);
  }
}
