import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';
@Injectable({
  providedIn: 'root',
})
export class FileExistenceService {
  constructor(private http: HttpClient,
    private toster: HotToastService) {}

  checkFileExists(url: string) {
    return this.http.head(url).pipe(
      this.toster.observe({
          success: 'Pdf Fetched Successfully',
          loading: 'Loading Pdf Data...',
          error: ({ statusText }) => `${statusText}`
      })
  );;
  }
}
