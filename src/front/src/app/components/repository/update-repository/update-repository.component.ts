import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from 'src/app/services/repository-service.service';

@Component({
  selector: 'app-update-repository',
  templateUrl: './update-repository.component.html',
  styleUrls: ['./update-repository.component.css']
})
export class UpdateRepositoryComponent implements OnInit {
  id: string;
  repositoryForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    type: new FormControl('', [Validators.required]),
    apiPrefix: new FormControl('/api/v1'),
    port: new FormControl(3000, [Validators.required]),
    dbConnectionUri: new FormControl('postgresql://localhost:5432/postgres', [Validators.required]),
  });

  constructor(private repositoryService: RepositoryService, private activatedRoute: ActivatedRoute, private router: Router, private snackBar: MatSnackBar){
    this.id = this.activatedRoute.snapshot.params['repositoryId'];
  }

  get name() {
    return this.repositoryForm.get('name');
  }

  set repoName(value: string) {
    this.repositoryForm.controls.name.setValue(value);
  }

  get apiPrefix() {
    return this.repositoryForm.get('apiPrefix');
  }

  get repoType() {
    return this.repositoryForm.get('type');
  }

  set apiPrefixSetter(value: string) {
    this.repositoryForm.controls.apiPrefix.setValue(value);
  }

  get port() {
    return this.repositoryForm.get('port');
  }

  set portSetter(value: number) {
    this.repositoryForm.controls.port.setValue(value);
  }

  get dbConnectionUri() {
    return this.repositoryForm.get('dbConnectionUri');
  }

  set dbConnectionUriSetter(value: string) {
    this.repositoryForm.controls.dbConnectionUri.setValue(value);
  }

  set typeSetter(value: string) {
    this.repositoryForm.controls.type.setValue(value);
  }

  ngOnInit(): void {
    this.repositoryService.getRepositoryById(this.id)
    .subscribe(
      (data: any) => {
        this.repoName = data.name;
        this.apiPrefixSetter = data.config.apiPrefix;
        this.portSetter = data.config.port;
        this.dbConnectionUriSetter = data.config.dbConnectionUri;
        this.typeSetter = data.type;
      }
    )
  }

  OnSubmit() {
    if (this.repositoryForm.valid) {
      this.repositoryService.updateRepositoryName(this.id, {
        name: this.repositoryForm.value.name!,
        type: this.repositoryForm.value.type!,
        config: {
          apiPrefix: this.repositoryForm.value.apiPrefix!,
          port: this.repositoryForm.value.port!,
          dbConnectionUri: this.repositoryForm.value.dbConnectionUri!
        }
      })
      .subscribe(
        data => {
          this.router.navigate(['repositories'])
        },
        err => this.snackBar.open(err.error.message, undefined, { duration: 2500 })
      )
    }
  }
}
