import { Component, DestroyRef, ElementRef, EventEmitter, inject, output, Output, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { interval, takeUntil, timer } from 'rxjs';
import { Tracking } from '../tracking';

@Component({
  imports: [],
  selector: 'app-livecam',
  styleUrl: './livecam.scss',
  templateUrl: './livecam.html',
})
export class Livecam {
  @ViewChild('video')
  private videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('viewsFrenzy')
  private viewsFrenzyRef!: ElementRef<HTMLDivElement>;
  
  viewCount = output<number>();
  like = output<void>();

  private readonly translate = inject(TranslateService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly tracking = inject(Tracking);
  debugCamera = signal('');
  private readonly viewFrenzyStop = signal(false);

 
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
    const viewFrenzy = this.viewsFrenzyRef.nativeElement;
    ['mousedown', 'touchstart'].forEach(action => viewFrenzy.addEventListener(action, event => this.viewFrenzyStart(event)));
    ['mouseup', 'mouseleave', 'touchend'].forEach(action => viewFrenzy.addEventListener(action, () => this.viewFrenzyStop.set(true)));
    timer(0,5000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() =>  this.viewCount.emit(Math.floor(Math.random() * 20) - 10));
    timer(0,300).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (Math.random() < this.likeFrenzyArray[0]) {
        this.like.emit();
      }
    })
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
      const video = this.videoRef.nativeElement;
      video.srcObject = this.stream;
      await video.play();
      // const track = this.stream.getTracks()[0];
      // this.debugCamera.set(JSON.stringify({
      //   video: `w:${video.videoWidth} h:${video.videoHeight}`,
      //   settings: track.getSettings(),
      //   capabilities: track.getCapabilities()
      // }, null, 2));
      this.irParaFullScreen();

    } catch (error) {
      var message;
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        message = this.translate.instant('error.unauthorizedCamera');
        this.tracking.track('camera_unauthorized');
      } else {
        message = this.translate.instant('error.genericCamera');
        this.tracking.track('camera_error', {'error':error})
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

  private viewFrenzyStart(event: Event) {
    event.preventDefault();
    this.viewFrenzyStop.set(false);
    let i = 0;
    let interval = setInterval(() => {
      if (this.viewFrenzyStop()) {
        clearInterval(interval);
        this.tracking.track('view_frenzy',{'frenzy_duration': `${i * 200}`})
        return;
      }
      if (++i < 10) { //2s
        this.viewCount.emit(Math.floor(Math.random() * 5))
      } else if (i < 50) { //10s
        this.viewCount.emit(Math.floor(Math.random() * 50))
      } else {
        this.viewCount.emit(Math.floor(Math.random() * 500))
      }
    }, 200);
  }

  private likeFrenzyArray = [0,0.08,0.16,0.32,0.64];

  likeFrenzy() {
    this.likeFrenzyArray.push(this.likeFrenzyArray.shift()!);
    this.tracking.track('like_frenzy', {'frenzy_outcome': this.likeFrenzyArray[0]})
  }

}
