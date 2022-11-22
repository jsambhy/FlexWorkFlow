/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CalculationsComponent } from './calculations.component';

let component: CalculationsComponent;
let fixture: ComponentFixture<CalculationsComponent>;

describe('calculations component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CalculationsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CalculationsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});