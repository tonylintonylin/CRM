import { Component, OnInit } from '@angular/core';
import { Opportunity } from '../interfaces/opportunity';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss'],
})
export class OpportunitiesComponent implements OnInit {
  opportunity: Opportunity = {
    id: 1,
    name: 'Tony'
  };

  constructor() {}

  ngOnInit(): void {}
}
