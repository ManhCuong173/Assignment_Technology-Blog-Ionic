import { TestBed } from '@angular/core/testing';

import { ManageArticleGuard } from './manage-article.guard';

describe('ManageArticleGuard', () => {
  let guard: ManageArticleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ManageArticleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
