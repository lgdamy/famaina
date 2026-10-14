import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  imports: [],
  selector: 'app-livecam',
  styleUrl: './livecam.scss',
  templateUrl: './livecam.html',
})
export class Livecam {
  @ViewChild('video')
  private videoRef!: ElementRef<HTMLVideoElement>;

  private readonly translate = inject(TranslateService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  debugCamera = signal('');

 
  private currentResolution: 1|2|3|4 = 4;
  private readonly resolutions = {
    1: {height: {ideal: 480}, width: {ideal: 854}},
    2: {height: {ideal: 720}, width: {ideal: 1280}},
    3: {height: {ideal: 1080}, width: {ideal: 1920}},
    4: {height: {ideal: 2160}, width: {ideal: 3840}}
  }
  private readonly constraints = {frameRate: {ideal: 30},facingMode: 'user',resizeMode: 'none'}

  private stream?: MediaStream;

  async ngAfterViewInit() {
    await this.iniciarCamera();
  }

  ngOnDestroy(): void {
    this.sairFullScreen();
    this.stream?.getTracks().forEach(track => track.stop());
  }

  async iniciarCamera(): Promise<void> {
    try {             
      const videoConstraints = {
          ...this.resolutions[this.currentResolution],
          ...this.constraints
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: videoConstraints
      });
      const track = this.stream.getTracks()[0];
      const video = this.videoRef.nativeElement;
      video.srcObject = this.stream;
      await video.play();
      // this.debugCamera.set(JSON.stringify({
      //   video: `w:${video.videoWidth} h:${video.videoHeight}`,
      //   settings: track.getSettings(),
      //   capabilities: track.getCapabilities()
      // }, null, 2));
      this.irParaFullScreen();

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

  private irParaFullScreen() {
    const elem = document.documentElement as any;
    const methodToBeInvoked = elem['requestFullscreen'] || elem['webkitRequestFullScreen'] || elem['mozRequestFullscreen'] || elem['msRequestFullscreen'];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

  private sairFullScreen() {
    const elem = document as any;
    const methodToBeInvoked = elem.exitFullscreen || elem.webkitExitFullscreen || elem.mozCancelFullScreen || elem.msExitFullscreen;
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

  async resolution(option: 'up' | 'down') {
    if (this.currentResolution === 4 && option === 'up') return
    if (this.currentResolution === 1 && option === 'down') return
    const track = this.stream?.getVideoTracks()[0];
    if (!track) return;
    if (option === 'up') this.currentResolution++;
    if (option === 'down') this.currentResolution--;
    await track.applyConstraints({...this.resolutions[this.currentResolution],...this.constraints});
    // this.debugCamera.set(JSON.stringify({
    //   settings: track.getSettings(),
    //   capabilities: track.getCapabilities()
    // }, null, 2));
  }

}
