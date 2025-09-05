import {
  AbstractControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  RequiredValidator,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Component, computed, input, signal } from '@angular/core';

import { AuthService } from '../../services/backend/auth.service';
import { LocalDataService } from '../../services/ui/local-data.service';
import { ObservableHandler } from '../utils/Obserbable-handler';
import { ReactiveFormsModule } from '@angular/forms';
import { effect } from '@angular/core';
import { finalize } from 'rxjs';
import { isTokenExpired } from '../utils/token-decoder';
// import { ConnectionStatusService } from '../../services/ui/connection-status.service';
import { CredetialConnectionService } from '../../services/ui/credetial-connection.service';

export type Credentials = {
  username: string;
  password: string;
  serverInformation: AdditionalInfo;
  store?: string;
  token?: string;
};

export type AdditionalInfo = {
  server: string;
  apiKey: string;
  apiSecret: string;
  organization: string;
  dataBase: string;
};

@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.css',
})
export class CredentialsComponent {
  origin = input<'Source' | 'Target'>();
  store = input<'V5' | 'Cloud'>();
  isLoading = signal<boolean>(false);
  tokenIsProvide = signal<boolean>(false);

  readonly buttonLabel = computed(() => {
    if (this.tokenIsProvide() && !this.isLoading()) {
      return 'Conectado';
    } else if (this.isLoading()) {
      return 'Validando ....';
    } else {
      return 'Guardar';
    }
  });

  /**
   *
   */
  loginForm!: any | FormGroup;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly storage: LocalDataService,
    private readonly authService: AuthService,
    private readonly connectionStatus: CredetialConnectionService,
  ) {
    this.loginForm = this.fb.group({
      username: this.fb.control('', {
        validators: [Validators.required],
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      server: this.fb.control('', {
        validators: [Validators.required, CredentialsComponent.urlOrIpValidator()], //Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(:[0-9]{1,5})?(\/[^\s]*)?$/i)],
      }),
      xapikey: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      xapisecret: this.fb.control(
        '',
        this.conditionalValidator(() => this.store() === 'Cloud', Validators.required),
      ),
      organization: this.fb.control(
        '',
        this.conditionalValidator(() => this.store() === 'Cloud', Validators.required),
      ),
      database: this.fb.control(this.store() === 'V5' ? 'ProdoctivityDb' : '', [
        this.conditionalValidator(() => this.store() === 'V5', Validators.required),
      ]),
    });

    (this.loginForm as FormGroup).valueChanges.subscribe((changes) => {
      this.tokenIsProvide.set(false);
    });

    effect(
      () => {
        let storeVersion = this.store() === 'Cloud' ? 'V6' : 'V5';
        let key = `Credentials_${storeVersion}_${this.store()}`;
        const myLocalCredential = this.storage.getValue<Credentials>(key);

        if (myLocalCredential) {
          const form = {
            username: myLocalCredential.username,
            password: myLocalCredential.password,
            server: myLocalCredential.serverInformation.server,
            xapikey: myLocalCredential.serverInformation.apiKey,
            xapisecret: myLocalCredential.serverInformation.apiSecret,
            organization: myLocalCredential.serverInformation.organization,
            database: myLocalCredential.serverInformation.dataBase,
          };
          this.loginForm.setValue(form);
          const isExpired = isTokenExpired(myLocalCredential.token);
          if (isExpired) {
            // alert('Token guardado expirado')
            this.tokenIsProvide.set(false);
          } else {
            this.tokenIsProvide.set(true);
          }
        }
        if (this.store() !== 'Cloud') {
          (this.loginForm as FormGroup).controls['organization'].setValue('ValueNotRequired');
          (this.loginForm as FormGroup).controls['xapisecret'].setValue('ValueNotRequired');
        }
      },
      { allowSignalWrites: true },
    );
  }

  private conditionalValidator(condition: () => boolean, validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return condition() ? validator(control) : null;
    };
  }

  getFirstInvalidField(): string | null {
    for (const key of Object.keys(this.loginForm.controls)) {
      const control = this.loginForm.get(key);
      if (control && control.invalid) {
        return key;
      }
    }
    return null;
  }

  static urlOrIpValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No validar si está vacío (required se encarga de eso)
      }

      const value = control.value.trim();

      // Patterns separados para mayor claridad
      const domainPattern = /^(https?:\/\/)?([\da-z.-]+\.[a-z]{2,6})(:[0-9]{1,5})?(\/[^\s]*)?$/i;
      const ipPattern =
        /^(https?:\/\/)?(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?(\/[^\s]*)?$/i;
      const localhostPattern = /^(https?:\/\/)?localhost(:[0-9]{1,5})?(\/[^\s]*)?$/i;

      const isValid =
        domainPattern.test(value) || ipPattern.test(value) || localhostPattern.test(value);

      return isValid ? null : { invalidUrl: { value: control.value } };
    };
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isLoading.set(false);
      //console.log(this.getFirstInvalidField())
      return;
    }

    let storeVersion = this.store() === 'Cloud' ? 'V6' : 'V5';
    let key = `Credentials_${storeVersion}_${this.store()}`;
    const credentials: Credentials = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value,
      store: this.store(),
      serverInformation: {
        apiKey: this.loginForm.controls.xapikey.value,
        apiSecret: this.loginForm.controls.xapisecret.value,
        organization: this.loginForm.controls.organization.value,
        dataBase: this.loginForm.controls.database.value,
        server: this.loginForm.controls.server.value,
      },
    };
    ObservableHandler.handle(this.authService.login(credentials))
      .onStart(() => this.isLoading.set(true))
      .onComplete(() => this.isLoading.set(false))
      .onNext((value) => {
        if (this.store() === 'Cloud') {
          credentials.token = value.data.token;
        } else {
          credentials.token = 'Norequired';
        }

        if (key === 'Credentials_V6_Cloud') {
          this.connectionStatus.updateCredentials(credentials);
        } else {
          this.storage.storeValue(key, credentials);
        }
      })
      .onError((err) => {
        //console.log(err)
      })
      .execute();
    // this.authService.login(credentials)
    // .pipe(
    //   finalize(() => this.isLoading.set(false))
    // ).subscribe((token) => {
    //   if (this.store() === 'Cloud') {
    //     credentials.token = token.data.token
    //   }
    //   this.isLoading.set(false)
    //   this.tokenIsProvide.set(true)
    //   this.storage.storeValue(key, credentials)
    // });
  }

  displayButtonLabelByState = () => {};
}
