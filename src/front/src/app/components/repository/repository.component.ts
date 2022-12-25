import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../services/repository-service.service';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
  id: string;
  isPrivate: boolean;
  isUserOwner: boolean;
  jsonSchema: string = '{}';
  controllerTemplate: string = '(empty)';
  serviceTemplate: string =  '(empty)';
  entityTemplate: string =  '(empty)';

  constructor(private activatedRoute: ActivatedRoute, private repositoryService: RepositoryService){
    this.id = activatedRoute.snapshot.params['repositoryId'];
  }

  ngOnInit(): void {
    this.repositoryService.isUserRepositoryOwner(this.id)
      .subscribe(
        data => { this.isUserOwner = data.isUserOwner }
      );

    this.repositoryService.isRepositoryPrivate(this.id)
      .subscribe(
        data => { this.isPrivate = data.isPrivate }
      );
  }
}
