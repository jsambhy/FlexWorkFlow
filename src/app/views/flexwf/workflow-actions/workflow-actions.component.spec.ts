/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkflowActionsComponent } from './workflow-actions.component';

let component: WorkflowActionsComponent;
let fixture: ComponentFixture<WorkflowActionsComponent>;

describe('workflow-actions component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkflowActionsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkflowActionsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});