import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListArticlePage } from './list-article.page';

describe('ListArticlePage', () => {
  let component: ListArticlePage;
  let fixture: ComponentFixture<ListArticlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListArticlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListArticlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
