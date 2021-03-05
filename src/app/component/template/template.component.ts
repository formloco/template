import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../../environments/environment';

import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from "../../service/template.service";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  templates;

  fileArray = [];
  isError = false;
  isNotFile = true;
  isImportOpen = false;

  previewUrl = environment.previewUrl;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private templateService: TemplateService) { }

  ngOnInit() {
    this.templateService.get().subscribe(templates => {
      this.templates = templates;
      this.templates = this.templates.filter(form => form.is_published === true);
      console.log(this.templates)
    });
  }

  goPIN() {
    this.router.navigate(['admin']);
  }

  previewForm(template) {
    window.open(this.previewUrl+'/preview?id='+template.id, '_blank');
  }
  
}


