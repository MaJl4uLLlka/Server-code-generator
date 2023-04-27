import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RepositoryService } from '../../../services/repository-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-repository',
  templateUrl: './create-repository.component.html',
  styleUrls: ['./create-repository.component.css']
})
export class CreateRepositoryComponent {
  repositoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('REST_API', [Validators.required]),
    apiPrefix: new FormControl('/api/v1'),
    port: new FormControl(3000, [Validators.required]),
    dbConnectionUri: new FormControl('postgresql://localhost:5432/postgres', [Validators.required]),
  });

  constructor(private repositoryService: RepositoryService, private router: Router, private snackBar: MatSnackBar) { }

  get name() {
    return this.repositoryForm.get('name');
  }

  set repoName(value: string) {
    this.repositoryForm.controls.name.setValue(value);
  }

  get apiPrefix() {
    return this.repositoryForm.get('apiPrefix');
  }

  set apiPrefixSetter(value: string) {
    this.repositoryForm.controls.apiPrefix.setValue(value);
  }

  get port() {
    return this.repositoryForm.get('port');
  }

  get type() {
    return this.repositoryForm.get('type');
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

  ngOnInit(): void { }

  OnSubmit() {
    if (this.repositoryForm.valid) {
      const { value } = this.repositoryForm;
      const config = {
        apiPrefix: value.apiPrefix,
        port: value.port,
        dbConnectionUri: value.dbConnectionUri,
      };
      this.repositoryService.createRepository({
        name: value.name as string,
        type: value.type!,
        config
      })
        .subscribe(
          data => { this.router.navigate(['repositories']) },
          err => this.snackBar.open(err.error.message, undefined, { duration: 2500 })
        )
    }
  }
}
