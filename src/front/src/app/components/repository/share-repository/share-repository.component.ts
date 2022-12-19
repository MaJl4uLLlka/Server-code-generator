import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../../services/repository-service.service';

@Component({
  selector: 'app-share-repository',
  templateUrl: './share-repository.component.html',
  styleUrls: ['./share-repository.component.css']
})
export class ShareRepositoryComponent {
  id: string;
  repositoryForm = new FormGroup({
    nick: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)])
  });

  constructor(private repositoryService: RepositoryService, private activatedRoute: ActivatedRoute, private router: Router){
    this.id = this.activatedRoute.snapshot.params['repositoryId'];
  }

  get nick() {
    return this.repositoryForm.get('nick');
  }

  ngOnInit(): void {}

  OnSubmit() {
    if (this.repositoryForm.valid) {
      this.repositoryService.shareRepository(this.id, this.repositoryForm.value as any)
      .subscribe(
        data => {
          this.router.navigate(['repositories'])
        }
      )
    }
  }
}
