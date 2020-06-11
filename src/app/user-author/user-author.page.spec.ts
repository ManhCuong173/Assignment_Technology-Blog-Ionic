import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserAuthorPage } from './user-author.page';

describe('UserAuthorPage', () => {
  let component: UserAuthorPage;
  let fixture: ComponentFixture<UserAuthorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAuthorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserAuthorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
