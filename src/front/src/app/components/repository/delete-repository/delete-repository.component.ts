import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../../services/repository-service.service';

@Component({
  selector: 'app-delete-repository',
  templateUrl: './delete-repository.component.html',
  styleUrls: ['./delete-repository.component.css']
})
export class DeleteRepositoryComponent {
  id: string;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private repositoryService: RepositoryService){
    this.id = activatedRoute.snapshot.params['repositoryId'];
  }

  OnSubmit() {
    this.repositoryService.deleteRepository(this.id)
    .subscribe(
      data => {
        this.router.navigate(['repositories']);
      }
    )
  }
}
