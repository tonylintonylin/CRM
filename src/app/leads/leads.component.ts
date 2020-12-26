// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-leads',
//   templateUrl: './leads.component.html',
//   styleUrls: ['./leads.component.scss'],
// })
// export class LeadsComponent implements OnInit {
//   leads: any[];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.http.get('https://localhost:5001/api/leads').subscribe(
//       (response: any) => {
//         this.leads = response.items;
//         console.log(response);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
})
export class LeadsComponent implements AfterViewInit {
  leadsColumns: string[] = [
    // 'created',
    // 'number',
    'Name',
    'title',
    'company',
    'email',
    'rating',
    'status',
    'ownerAlias',
  ];
  leadsDatabase: ExampleHttpDatabase | null;
  leadsData: Lead[] = [];

  leadsLength = 0;
  isLoadingLeads = true;
  isLeadsRateLimitReached = false;

  @ViewChild(MatPaginator) leadsPaginator: MatPaginator;
  @ViewChild(MatSort) leadsSort: MatSort;

  // displayedColumns: string[] = ['created', 'state', 'number', 'title'];
  // exampleDatabase: ExampleHttpDatabase | null;
  // data: GithubIssue[] = [];

  // resultsLength = 0;
  // isLoadingResults = true;
  // isRateLimitReached = false;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  constructor(private _httpClient: HttpClient) {}

  ngAfterViewInit() {
    this.leadsDatabase = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.leadsSort.sortChange.subscribe(
      () => (this.leadsPaginator.pageIndex = 0)
    );

    merge(this.leadsSort.sortChange, this.leadsPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingLeads = true;

          return this.leadsDatabase!.getLeads(
            this.leadsSort.active,
            this.leadsSort.direction,
            this.leadsPaginator.pageIndex
          );
        }),
        map((leadsData) => {
          // Flip flag to show that loading has finished.
          this.isLoadingLeads = false;
          this.isLeadsRateLimitReached = false;
          this.leadsLength = leadsData.rows;

          console.log(leadsData);

          return leadsData.items;
        }),
        catchError(() => {
          this.isLoadingLeads = false;
          // Catch if the API has reached its rate limit. Return empty data.
          this.isLeadsRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe((leadsData) => (this.leadsData = leadsData));

    //github api example

    //   this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    //   // If the user changes the sort order, reset back to the first page.
    //   this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    //   merge(this.sort.sortChange, this.paginator.page)
    //     .pipe(
    //       startWith({}),
    //       switchMap(() => {
    //         this.isLoadingResults = true;
    //         return this.exampleDatabase!.getRepoIssues(
    //           this.sort.active,
    //           this.sort.direction,
    //           this.paginator.pageIndex
    //         );
    //       }),
    //       map((data) => {
    //         // Flip flag to show that loading has finished.
    //         this.isLoadingResults = false;
    //         this.isRateLimitReached = false;
    //         this.resultsLength = data.total_count;

    //         return data.items;
    //       }),
    //       catchError(() => {
    //         this.isLoadingResults = false;
    //         // Catch if the GitHub API has reached its rate limit. Return empty data.
    //         this.isRateLimitReached = true;
    //         return observableOf([]);
    //       })
    //     )
    //     .subscribe((data) => (this.data = data));
  }
}

// export interface GithubApi {
//   items: GithubIssue[];
//   total_count: number;
// }

// export interface GithubIssue {
//   created_at: string;
//   number: string;
//   state: string;
//   title: string;
// }

export interface LeadApi {
  items: Lead[];
  rows: number;
}

export interface Lead {
  number: string;
  name: string;
  title: string;
  company: string;
  email: string;
  rating: string;
  status: string;
  ownerAlias: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getLeads(sort: string, order: string, page: number): Observable<LeadApi> {
    const href = 'https://localhost:5001/api/leads';
    // const requestUrl = `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${
    //   page + 1
    // }`;
    //  const requestUrl = `${href}?q=repo:angular/components&sort=${sort}&page=${
    //    page + 1
    //  }`;
    if (order == 'desc') order = '-';
    else order = '';

    const requestUrl = `${href}?Page=${page + 1}&Sort=${order}${sort}`;
    // return this._httpClient.get<LeadApi>(href);
    return this._httpClient.get<LeadApi>(requestUrl);
  }

  // getRepoIssues(
  //   sort: string,
  //   order: string,
  //   page: number
  // ): Observable<GithubApi> {
  //   const href = 'https://api.github.com/search/issues';
  //   const requestUrl = `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${
  //     page + 1
  //   }`;

  //   return this._httpClient.get<GithubApi>(requestUrl);
  // }
}
