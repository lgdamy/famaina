import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Configurations } from '../configurations';
import { timer } from 'rxjs';
import { Livecam } from '../livecam/livecam';

interface EmojiLike {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  drift: number;
}

@Component({
  imports: [MatButtonModule, MatIconModule, TranslatePipe, RouterModule, Livecam],
  selector: 'app-instalive',
  styleUrl: './instalive.scss',
  templateUrl: './instalive.html',
})
export class Instalive {
  private readonly router = inject(Router);
  private readonly configurations = inject(Configurations);
  private readonly emojis = ['❤️', '😍', '🥰', '😂', '🔥','👏', '💖', '💕', '👍', '✨'];
  
  private nextLikeId = 0;
  private likeFrenzyOdd = 0;
  private likeFrenzyArray = [0,0.075,0.15,0.3,0.6];

  readonly compactNumber = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  });
  readonly likes = signal<EmojiLike[]>([]);
  readonly username: string = this.configurations.username;
  readonly viewCount = signal(100);
  
  ngOnInit(): void {
    timer(0,2000).subscribe(() => this.viewCount.update(count => count+= Math.round(Math.random() * 10)))
    timer(0,350).subscribe(() => {
      if (Math.random() < this.likeFrenzyOdd) {
        this.dispatchLike();
      }
    })
  }

  encerrar() {
    this.router.navigate(['']);
  }

  incrementViewCount() {
    this.viewCount.update((count => count+= Math.round(Math.random() * 50)));
  }

  likeFrenzy() {
    this.likeFrenzyArray.push(this.likeFrenzyArray.shift()!);
    this.likeFrenzyOdd = this.likeFrenzyArray[0];
  }

  dispatchLike() {
    const id = ++this.nextLikeId;
    const like: EmojiLike = {
      id,
      emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)],
      left: 5 + Math.random() * 85,
      size: 20 + Math.random() * 20,
      duration: 2.5 + Math.random() * 2,
      drift: -40 + Math.random() * 80
    };
    this.likes.update(current => [...current, like]);
    setTimeout(() => this.likes.update(current => current.filter(item => item.id !== id)), like.duration * 1000);
  }
}
