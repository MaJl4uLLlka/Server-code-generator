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
    type: new FormControl('', [Validators.required]),
  });
  selected = 'PUBLIC'

  constructor(private repositoryService: RepositoryService, private router: Router, private snackBar: MatSnackBar){}

  get name() {
    return this.repositoryForm.get('name');
  }

  set repoName(value: string) {
    this.repositoryForm.controls.name.setValue(value);
  }

  ngOnInit(): void {}

  OnSubmit() {
    if (this.repositoryForm.valid) {
      this.repositoryService.createRepository(this.repositoryForm.value as any)
      .subscribe(
        data => { this.router.navigate(['repositories'])},
        err => this.snackBar.open(err.error.message, undefined, { duration: 2500 })
      )
    }
  }
}
