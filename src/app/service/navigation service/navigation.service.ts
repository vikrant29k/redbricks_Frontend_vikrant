import { Injectable } from '@angular/core'
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router'

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
  private history: string[] = []

  constructor(private router: Router, private location: Location) { }

  public startSaveHistory():void{
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.history.push(event.urlAfterRedirects)
        }
      })
  }

  public getHistory(): string[] {
    console.log(this.history);
    return this.history;
  }

  public goBack(): void {
    this.history.pop();
 
    if (this.history.length > 0) {
        console.log(this.location);
      this.location.back();
    } else {
        console.log(this.location.back());
      this.router.navigateByUrl("/")
    }
  }

  public getPreviousUrl(): string {
    console.log(this.history);
    if (this.history.length > 0) {
        console.log("length",this.history.length);
        return this.history[this.history.length - 2];
    }

    return '';
  }
}