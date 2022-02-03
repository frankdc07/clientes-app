import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
import swal from 'sweetalert2';

import { Usuario } from './usuario'
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = "Por favor iniciar sesion!";
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()) {
      swal.fire('Login', `Hola ${this.authService.usuario.username}, ya estas autenticado`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    if(this.usuario.username == null || this.usuario.password == null){
      swal.fire( 'Error Login', 'Los campos no pueden estar vacíos', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.router.navigate(['/clientes']);
      swal.fire('Login', `Hola ${usuario.username}, has iniciado sesión con éxito!`, 'success');
    },
    err => {
      if(err.status == 400) {
        swal.fire('Error login', 'Usuario y/o contraseña incorrectos', 'error');
      }
    });
  }

}
