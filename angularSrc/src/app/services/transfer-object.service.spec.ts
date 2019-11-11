import { TestBed } from '@angular/core/testing';

import { TransferObjectService } from './transfer-object.service';

describe('TransferObjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransferObjectService = TestBed.get(TransferObjectService);
    expect(service).toBeTruthy();
  });
});
