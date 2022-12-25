import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)])
  });

  constructor(private repositoryService: RepositoryService, private activatedRoute: ActivatedRoute, private router: Router){
    this.id = this.activatedRoute.snapshot.params['repositoryId'];
  }

  get repoName() {
    return this.repositoryForm.get('name');
  }

  set repositoryName(value: string) {
    this.repositoryForm.controls.name.setValue(value);
  }

  ngOnInit(): void {
    this.repositoryService.getRepositoryById(this.id)
    .subscribe(
      data => {
        this.repositoryName = (data as any).name;
      }
    )
  }

  OnSubmit() {
    if (this.repositoryForm.valid) {
      this.repositoryService.updateRepositoryName(this.id, this.repositoryForm.value as any)
      .subscribe(
        data => {
          this.router.navigate(['repositories'])
        }
      )
    }
  }
}
