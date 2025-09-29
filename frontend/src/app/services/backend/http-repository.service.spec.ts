// eslint-disable
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SchemaService } from './schema.service';
import { SCHEMA_REPOSITORY } from '../../types/tokens/SCHEMA_REPOSITORY';
import { Repository } from '../../types/contracts/repository.interface';
// import { Repository } from './repository.interface';
// import { SCHEMA_REPOSITORY } from './providers';
// import { DocumentGroup } from '../../types/contracts/ISchema';

describe('SchemaService', () => {
  let service: SchemaService;
  let mockRepository: jasmine.SpyObj<Repository<object>>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj<Repository<object>>('Repository', ['post']);
    mockRepository.post.and.returnValue(
      of({ data: [{ groupId: '1', groupName: 'Test', documentTypesCounter: 0 }], success: true }),
    );

    TestBed.configureTestingModule({
      providers: [SchemaService, { provide: SCHEMA_REPOSITORY, useValue: mockRepository }],
    });

    service = TestBed.inject(SchemaService);
  });

  it('should fetch document groups', (done) => {
    // eslint-disable-next-line
    service.getDocumentGruops({} as any).subscribe((result) => {
      expect(result.data).toEqual([{ groupId: '1', groupName: 'Test', documentTypesCounter: 0 }]);
      expect(mockRepository.post).toHaveBeenCalledWith('', {});
      done();
    });
  });
});
