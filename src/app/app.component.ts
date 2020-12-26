import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'CRM';
  leads: any[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/leads').subscribe(
      (response: any) => {
        this.leads = response.items;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
