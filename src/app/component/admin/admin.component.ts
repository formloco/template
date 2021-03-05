import { Component, OnInit } from '@angular/core';

import * as uuid from 'uuid';
import { Router, ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';

import { AuthService } from "../../service/auth.service";
import { TemplateService } from "../../service/template.service";

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  token;
  templates;
  templateControls;

  templateForm: FormGroup;

  fileArray = [];
  isError = false;
  isNotFile = true;
  isImportOpen = false;

  pinKeySecret = environment.pinKeySecret;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private templateService: TemplateService) { 
      this.templateForm = this.formBuilder.group({
        templateArray: this.formBuilder.array([])
      });
    }

  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates() {
    this.templateService.get().subscribe(templates => {
      this.templates = templates;
      this.templates.forEach(element => {
        const _templates = this.templateForm.controls.templateArray as FormArray;
        _templates.push(this.formBuilder.group({
          name: [element.form.name],
          description: [element.description],
          is_published: [element.is_published]
        }));
      });
    });
  }

  resetCards() {
    let arr = this.templateForm.controls.templateArray as FormArray;
    arr.clear();
    this.getTemplates();
  }

  import() {
    this.fileArray.forEach(element => {
      if (element.type === 'application/json') {

        let formObj = JSON.parse(atob(element.content.slice(29)))

        if (formObj.form.details.length === formObj.form.controls.length) {
          this.templateControls = formObj.form;

          // todo: move genSQL to backend as it is used in formloco frontend as well
          let obj = this.templateService.generateSQLStructure(this.templateControls);
          this.templateControls["labels"] = obj.labels;
          this.templateControls["columns"] = obj.columns;

          let userCreated = { email: 'polly@formloco.com', date_created: new Date() }

          let templateObj = ({ form: this.templateControls, user_created: userCreated });
          
          this.templateService.create(templateObj).subscribe(res => {
            this.fileArray = [];
            this.isImportOpen = false;
            this.resetCards();
            
          });
        }
        else this.isError = true;
      }
    });
  }

  closeOverlay() {
    this.isImportOpen = false;
  }

  onRemove(event) {
    this.fileArray.splice(this.fileArray.indexOf(event), 1);
  }

  goTemplates() {
    this.authService.loggedInStatus = false;
    this.router.navigate(['']);
  }

  onSelect(event) {
    this.isNotFile = false;
    this.fileArray.push(...event.addedFiles);
  
    this.fileArray.forEach(element => {
      this.readFile(element).then(fileContents => {
        element.content = fileContents;
      });
    });
  }

  onFilesRejected(files: File[]) {
    this.snackBar.open('Your file is too big, must be 20k or less.', "Error:",
      { duration: 5000 })
  }

  publish(template, idx) {
    let obj = template.value;
    obj["id"] = this.templates[idx]["id"];
    obj["user_updated"] = { email: 'polly@formloco.com', date_created: new Date() }
    this.templateService.publish(obj).subscribe(res => {});
  }

  save(template, idx) {
    let obj = template.value;
    obj["id"] = this.templates[idx]["id"];
    this.templates[idx]["form"]["name"] = obj.name;
    obj["form"] = this.templates[idx]["form"];
    obj["user_updated"] = { email: 'polly@formloco.com', date_created: new Date() }
    this.templateService.update(obj).subscribe(res => {});
  }

  delete(idx) {
    let id = this.templates[idx]["id"]
    this.templateService.delete(id).subscribe(res => {
      this.resetCards();
    });
  }

}