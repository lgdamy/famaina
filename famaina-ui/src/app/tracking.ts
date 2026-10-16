import { inject, Service } from '@angular/core';
import { Configurations } from './configurations';

declare var gtag : any;

@Service()
export class Tracking {
    private readonly configurations = inject(Configurations);

    track(eventName: string, metadata?: Record<string,any>) {
        gtag('event', eventName, {
            'username': this.configurations.username,
            ...metadata
        })
    }
}
