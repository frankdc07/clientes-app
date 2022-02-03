import { Component } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  title: string = 'App angular';

  constructor(private _authService: AuthService, private router: Router) {}

  public get authService(): AuthService {
    return this._authService;
  }

  public logout(): void {
    let username = this.authService.usuario.username;
    this.authService.logout();
    this.router.navigate(['/login']);
    swal.fire('Logout', `Adios ${username}, has finalizado la sesión con éxito!`, 'success');
  }

}
