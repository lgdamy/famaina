import { Service } from '@angular/core';

@Service()
export class Configurations {
    private $username?: string

    get username(): string {
        return this.$username!;
    }

    set username(username: string) {
        this.$username = username;
    }
}
