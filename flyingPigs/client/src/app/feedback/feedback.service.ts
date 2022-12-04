import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private url = 'http://localhost:5200';
    private feedbackSuccess$: Subject<{caseId: string}> = new Subject();
    private autoReplySuccess$: Subject<boolean> = new Subject();

    constructor(private httpClient: HttpClient) { }

    feedbackRoute(em: string, ty: string, tx: string) {
        this.httpClient.post<{caseId: string}>(`${this.url}/airports/feedback`, {email: em, type:ty, text: tx})
            .subscribe(success => {
                this.feedbackSuccess$.next(success);
            });
    }
    
    autoReplyRoute(em: string, ty: string, cId: string) {
        console.log("in autoReplyRoute", cId);
        this.httpClient.post<boolean>(`${this.url}/airports/autoReply`, {email: em, type:ty, caseId: cId})
        .subscribe(success => {
            this.autoReplySuccess$.next(success);
        });
    }
    
    sendFeedback(email: string, type: string, text: string): Subject<boolean> {
        if(type == 'complaint') {
            type = 'inquiry';
        }
        this.feedbackRoute(email, type, text);
        this.feedbackSuccess$.subscribe(value => {
            if(value) {
                this.autoReplyRoute(email, type, value.caseId);
            } else {
                // TODO: handle error
            }
        });
        return this.autoReplySuccess$;
    }
}