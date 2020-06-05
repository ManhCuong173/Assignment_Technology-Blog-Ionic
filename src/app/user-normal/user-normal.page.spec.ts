import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserNormalPage } from './user-normal.page';

describe('UserNormalPage', () => {
  let component: UserNormalPage;
  let fixture: ComponentFixture<UserNormalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNormalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserNormalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
