import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {
  isSigned = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isSigned().subscribe(
      data => {
        this.isSigned = true;
      });
  }
}
