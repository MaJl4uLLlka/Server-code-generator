import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../services/repository-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
  id: string;
  isUserOwner: boolean;
  displayedColumns: string[] = ['name'];
  linkColumns = ['from','linkType', 'to'];
  links: {from: string, to: string, linkType: string}[] = [];
  entities: { name: string}[] = [];
  services: { name: string}[] = [];
  controllers: { name: string}[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private repositoryService: RepositoryService,
    public dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ){
    this.id = activatedRoute.snapshot.params['repositoryId'];
  }

  ngOnInit(): void {
    this.repositoryService.isUserRepositoryOwner(this.id)
      .subscribe(
        data => { this.isUserOwner = data.isUserOwner }
      );

      this.loadData();
  }

  openDeleteRepositoryDialog(){
    const dialogRef = this.dialog.open(DeleteRepositoryDialog, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(needToDelete => {
      if(!needToDelete) {
        return;
      }

      this.repositoryService.deleteRepository(this.id)
        .subscribe(
          data => {
            this.router.navigate(['repositories']);
          }
        )
      });
  }

  downloadArchive() {
    this.repositoryService.downloadRepo(this.id)
      .subscribe(data => {
        let fileName = "repository.zip";
        saveAs(data.body!, fileName);
      }, 
      err => {
        console.log(err.error.message);
        this.snackBar.open(err.error.message, undefined, { duration: 2000 } );
      });
  }

  loadData() {
    this.repositoryService.getEntities(this.id)
      .subscribe(
        data => {
          this.entities = data.map(el => {return {name: el.name}});
        }
      );

    this.repositoryService.getLinks(this.id)
        .subscribe(
          data => {
            this.links = data;
          }
        );

    this.repositoryService.getServices(this.id)
        .subscribe(
          data => {
            this.services = data.map(el => {return {name: el.name}});
          }
        );

    this.repositoryService.getControllers(this.id)
          .subscribe(
            data => {
              this.controllers = data.map(el => {return {name: el.name}});
            }
          )

  }
}


@Component({
  selector: 'delete-repository-dialog',
  templateUrl: './delete-repository-dialog.html',
})
export class DeleteRepositoryDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteRepositoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
}