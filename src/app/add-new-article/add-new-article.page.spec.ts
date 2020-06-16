import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddNewArticlePage } from './add-new-article.page';

describe('AddNewArticlePage', () => {
  let component: AddNewArticlePage;
  let fixture: ComponentFixture<AddNewArticlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewArticlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewArticlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
