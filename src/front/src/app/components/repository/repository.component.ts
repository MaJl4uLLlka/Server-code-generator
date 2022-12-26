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
  isPrivate: boolean = false;
  isUserOwner: boolean;
  jsonSchema: string = '{"controller": "User", "service": "User", entity: "User"}';
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

    setTimeout(() => {
      let observable: any = null;

      if (this.isPrivate) {
        observable = this.repositoryService.getCompletedPrivateTemplate(this.id)
      }
      else {
        observable = this.repositoryService.getCompletedPublicTemplate(this.id)
      }
      observable.subscribe(
        (data: any) => {
          this.entityTemplate = data.entityTemplate;
          this.serviceTemplate = data.serviceTemplate;
          this.controllerTemplate = data.controllerTemplate;
      });

    }, 1500);
  }
}
