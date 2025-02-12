import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  version: string = '1.0.0';

  constructor(private utilsService: UtilsService) { }
  
  ngOnInit(): void {
    this.utilsService.getVersion().subscribe({
      next: (response) => {
        if (response.result) {
          this.version = response.errorMessage;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
