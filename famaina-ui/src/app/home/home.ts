import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Configurations } from '../configurations';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [TranslatePipe, MatButton, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  private readonly router = inject(Router);
  private readonly configurations = inject(Configurations);

  golive(form: {username: string, platform: string}) {
      this.configurations.username = form.username;
      this.router.navigate([`/${form.platform}`])
  }
}
