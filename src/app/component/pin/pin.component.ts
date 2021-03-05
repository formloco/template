import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "../../service/auth.service";
import { ErrorService } from "../../service/error.service";

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {

  token;
  pinForm: FormGroup;

  adminPin = environment.adminPin;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService) { 
    this.pinForm = this.fb.group({
      pin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  checkPIN() {
    if (this.adminPin == this.pinForm.controls['pin'].value) {
      this.authService.token().subscribe(token => {
        this.token = token;
        localStorage.setItem('formToken', this.token.token);
        this.authService.loggedInStatus = true;
        this.router.navigate(['templates']);
      });
    }
    else this.errorService.popSnackbar('Incorrect PIN');
  }

  goTemplates() {
    this.authService.loggedInStatus = false;
    this.router.navigate(['templates']);
  }

}
