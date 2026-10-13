import { Component, ElementRef, Inject, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Configurations } from '../configurations';
import { timer } from 'rxjs';

@Component({
  imports: [MatButtonModule, MatIconModule, TranslatePipe, RouterModule],
  selector: 'app-instalive',
  styleUrl: './instalive.scss',
  templateUrl: './instalive.html',
})
export class Instalive {

  @ViewChild('video')
  private videoRef!: ElementRef<HTMLVideoElement>;

  @ViewChild('cameraContainer')
  private containerRef!: ElementRef<HTMLDivElement>;
  private readonly snackbar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly configurations = inject(Configurations);
  readonly compactNumber = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  });

  cameraAtiva = signal(false);
  carregando = signal(false);
  username: string = this.configurations.username;
  viewCount = signal(100)

  private stream?: MediaStream;

  ngOnInit(): void {
    this.iniciarCamera();
    timer(0,2000).subscribe(() => this.viewCount.update(count => count+= Math.round(Math.random() * 10)))
  }

  async iniciarCamera(): Promise<void> {
    this.carregando.set(true);

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        }
      });

      const video = this.videoRef.nativeElement;
      video.srcObject = this.stream;

      await video.play();

      this.cameraAtiva.set(true);

      await this.containerRef.nativeElement.requestFullscreen();
      this.carregando.set(false);

    } catch (error) {
      var message;
      console.log(error)
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        message = this.translate.instant('error.unauthorizedCamera');
      } else {
        message = this.translate.instant('error.genericCamera');
      }
      this.snackbar.open(message, undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000
      });
      this.router.navigate(['']);
    }
  }

  incrementViewCount() {
    this.viewCount.update((count => count+= Math.round(Math.random() * 50)))
  }

  ngOnDestroy(): void {
    this.stream?.getTracks().forEach(track => track.stop());
  }
}
