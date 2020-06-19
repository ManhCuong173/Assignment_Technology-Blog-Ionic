import { TestBed } from '@angular/core/testing';

import { AddArticleGuard } from './add-article.guard';

describe('AddArticleGuard', () => {
  let guard: AddArticleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AddArticleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
