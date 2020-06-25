import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListArticleByTagPage } from './list-article-by-tag.page';

describe('ListArticleByTagPage', () => {
  let component: ListArticleByTagPage;
  let fixture: ComponentFixture<ListArticleByTagPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListArticleByTagPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListArticleByTagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
