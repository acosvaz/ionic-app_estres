import { Component, OnInit } from '@angular/core';
import { LoginUsuario } from 'src/app/models/login-usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { AlertController } from '@ionic/angular';
import { Resultado } from 'src/app/models/resultado';
import { TestService } from 'src/app/services/test.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: any = {};
  usuario: LoginUsuario;
  nombreUser: string;
  isLogged = false;
  isLoginFail = false;
  rol: string;
  id: number;
  errorMsg = '';
  resultados: Resultado [] = [];
  actual = '';
  fecha = '';
  //producto: Producto = null;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private alertController: AlertController,
    private testService: TestService
  ) { }

  ngOnInit() {

	if (this.tokenService.getToken()) {
    // comprobamos los valores del token
      
      this.nombreUser = this.tokenService.getUserName();
      this.isLogged = true;
      this.isLoginFail = false;
      this.rol = this.tokenService.getRol();
      this.id = Number(this.tokenService.getId());
    }

  }

  onLogin() {
    this.usuario = new LoginUsuario(this.form.username, this.form.password);

    this.authService.login(this.usuario).subscribe(data => {
      this.tokenService.setId(data.id.toString());
      this.tokenService.setToken(data.token);
      this.tokenService.setUserName(data.username);
      this.tokenService.setRol(data.rol);

      this.isLogged = true;
      this.isLoginFail = false;
      this.rol = this.tokenService.getRol();
      this.id = Number(this.tokenService.getId());
      window.location.reload();
    },
      (err: any) => {
        console.log(err);
        this.isLogged = false;
        this.isLoginFail = true;
        this.errorMsg = 'Intente de nuevo';
        this.presentAlert();
      }
    );
  }

    async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Usuario o contraseña incorrectos',
      message: this.errorMsg,
      buttons: ['Aceptar']
    });

    await alert.present();
  }


onLogout() {
  this.tokenService.logOut();
  window.location.reload();
}

}
