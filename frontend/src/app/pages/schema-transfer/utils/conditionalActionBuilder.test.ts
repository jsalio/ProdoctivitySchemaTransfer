// import { TestBed } from '@angular/core/testing';
// import { ConditionalActionBuilder } from './ConditionalActionBuilder';
// import { SchemaService } from '../../../services/backend/schema.service';
// import { ActionProgressService } from './ActionProgress.service';
// import { ObservableHandler } from '../../../shared/utils/Obserbable-handler';
// import { of, throwError } from 'rxjs';
// import { Credentials } from '../../../types/models/Credentials';
// import { ActionData } from './ActionData';

// describe('ConditionalActionBuilder - Context Preservation Tests', () => {
//   let builder: ConditionalActionBuilder;
//   let mockSchemaService: jasmine.SpyObj<SchemaService>;
//   let mockProgressService: jasmine.SpyObj<ActionProgressService>;
//   let mockExecutingActions: jasmine.SpyObj<any>;
//   let mockCredentials: Credentials;
//   let mockActionData: ActionData;

//   beforeEach(async () => {
//     // Mock services
//     mockSchemaService = jasmine.createSpyObj('SchemaService', [
//       'saveNewDocumentGroup',
//       'saveNewDocumentType', 
//       'saveNewKeyword',
//       'saveNewDocumentSchema'
//     ]);

//     mockProgressService = jasmine.createSpyObj('ActionProgressService', [
//       'updateStepProgress',
//       'getCurrentProgress'
//     ]);

//     mockExecutingActions = jasmine.createSpyObj('ExecutingActions', ['set']);

//     await TestBed.configureTestingModule({
//       providers: [
//         { provide: SchemaService, useValue: mockSchemaService },
//         { provide: ActionProgressService, useValue: mockProgressService }
//       ]
//     }).compileComponents();

//     // Initialize builder
//     builder = ConditionalActionBuilder.create(
//       mockSchemaService,
//       mockExecutingActions,
//       mockProgressService
//     );

//     // Mock credentials
//     mockCredentials = { 
//         password: 'test-password',
//         username: 'test-username',
//         token: 'test-token',
//         serverInformation: {
//             apiKey: 'test-api-key',
//             apiSecret: 'test-api-secret',
//             server: 'test-server',
//             organization: 'test-organization',
//             dataBase: 'test-database'
//         }
//     } as Credentials;

//     // Mock base action data
//     mockActionData = {
//       groupData: {
//         name: 'Test Group',
//         description: 'Test Description'
//       },
//       typeData: {
//         name: 'Test Document Type',
//         description: 'Test Type Description',
//         documentGroupId: undefined // Will be set by context
//       },
//       keywordsToCreate: [
//         {
//           name: 'Keyword 1',
//           description: 'Test Keyword 1',
//           documentTypeId: undefined // Will be set by context
//         },
//         {
//           name: 'Keyword 2', 
//           description: 'Test Keyword 2',
//           documentTypeId: undefined // Will be set by context
//         }
//       ],
//       keywordsToAssign: [
//         {
//           keywordId: 'existing-keyword-1',
//           name: 'Existing Keyword 1',
//           documentTypeId: undefined // Will be set by context
//         }
//       ]
//     } as ActionData;

//     // Setup mock return values
//     setupMockReturnValues();
//   });

//   function setupMockReturnValues() {
//     // Mock ObservableHandler for all schema operations
//     spyOn(ObservableHandler, 'handle').and.callFake((observable: any) => ({
//       executeAsyncClean: () => {
//         if (observable === mockSchemaService.saveNewDocumentGroup.calls.mostRecent()?.returnValue) {
//           return Promise.resolve({ data: { groupId: 'group-123' } });
//         }
//         if (observable === mockSchemaService.saveNewDocumentType.calls.mostRecent()?.returnValue) {
//           return Promise.resolve({ data: { documentTypeId: 'type-456' } });
//         }
//         if (observable === mockSchemaService.saveNewKeyword.calls.mostRecent()?.returnValue) {
//           return Promise.resolve({ data: { id: `keyword-${Date.now()}` } });
//         }
//         if (observable === mockSchemaService.saveNewDocumentSchema.calls.mostRecent()?.returnValue) {
//           return Promise.resolve({ id: `schema-${Date.now()}` });
//         }
//         return Promise.resolve({ data: {} });
//       }
//     }));

//     // Mock service return observables
//     mockSchemaService.saveNewDocumentGroup.and.returnValue(of({ data: { groupId: 'group-123' } }));
//     mockSchemaService.saveNewDocumentType.and.returnValue(of({ data: { documentTypeId: 'type-456' } }));
//     mockSchemaService.saveNewKeyword.and.returnValue(of({ data: { id: 'keyword-789' } }));
//     mockSchemaService.saveNewDocumentSchema.and.returnValue(of({ id: 'schema-101' }));
//   }

//   describe('🧪 Context Preservation Scenarios', () => {

//     describe('CDG_CDT - Group to DocumentType context preservation', () => {
//       it('should preserve documentGroupId from CDG step to CDT step', async () => {
//         // Arrange
//         const actionString = 'CDG_CDT';
//         builder.buildFromConditions(actionString);

//         // Act
//         const result = await builder.execute(mockCredentials, mockActionData);

//         // Assert
//         expect(result.documentGroupId).toBe('group-123');
//         expect(result.documentTypeId).toBe('type-456');
        
//         // Verify CDT received the correct groupId
//         expect(mockSchemaService.saveNewDocumentType).toHaveBeenCalledWith(
//           mockCredentials,
//           jasmine.objectContaining({
//             documentGroupId: 'group-123'
//           })
//         );
//       });

//       it('should handle missing documentGroupId gracefully in CDT', async () => {
//         // Arrange
//         mockActionData.typeData!.documentGroupId = 'fallback-group-id';
//         const actionString = 'CDT'; // Only CDT, no CDG
//         builder.buildFromConditions(actionString);

//         // Act
//         const result = await builder.execute(mockCredentials, mockActionData);

//         // Assert
//         expect(result.documentTypeId).toBe('type-456');
//         expect(mockSchemaService.saveNewDocumentType).toHaveBeenCalledWith(
//           mockCredentials,
//           jasmine.objectContaining({
//             documentGroupId: 'fallback-group-id'
//           })
//         );
//       });
//     });

//     describe('CDT_CDK - DocumentType to Keywords context preservation', () => {
//       it('should preserve documentTypeId from CDT step to CDK step', async () => {
//         // Arrange
//         const actionString = 'CDT_CDK';
//         builder.buildFromConditions(actionString);

//         // Act
//         const result = await builder.execute(mockCredentials, mockActionData);

//         // Assert
//         expect(result.documentTypeId).toBe('type-456');
//         expect(result.createdKeywords).toBeDefined();
//         expect(result.createdKeywords.length).toBe(2);

//         // Verify CDK received the correct typeId for both keywords
//         expect(mockSchemaService.saveNewKeyword).toHaveBeenCalledTimes(2);
//         mockSchemaService.saveNewKeyword.calls.all().forEach(call => {
//           expect(call.args[1]).toEqual(jasmine.objectContaining({
//             documentTypeId: 'type-456'
//           }));
//         });
//       });

//       it('should handle missing documentTypeId gracefully in CDK', async () => {
//         // Arrange
//         mockActionData.keywordsToCreate[0].documentTypeId = 'fallback-type-id';
//         mockActionData.keywordsToCreate[1].documentTypeId = 'fallback-type-id';
//         const actionString = 'CDK'; // Only CDK, no CDT
//         builder.buildFromConditions(actionString);

//         // Act
//         const result = await builder.execute(mockCredentials, mockActionData);

//         // Assert
//         expect(result.createdKeywords).toBeDefined();
//         expect(mockSchemaService.saveNewKeyword).toHaveBeenCalledWith(
//           mockCredentials,
//           jasmine.objectContaining({
//             documentTypeId: 'fallback-type-id'
//           })
//         );
//       });
//     });

//     describe('CDK_ADK - Keywords to Assignment context preservation', () => {
//       it('should preserve documentTypeId from CDK step to ADK step', async () => {
//         // Arrange
//         mockActionData.keywordsToCreate[0].documentTypeId = 'preset-type-id';
//         mockActionData.keywordsToCreate[1].documentTypeId = 'preset-type-id';
//         const actionString = 'CDK_ADK';
//         builder.buildFromConditions(actionString);

//         // Act
//         const result = await builder.execute(mockCredentials, mockActionData);

//         // Assert
//         expect(result.createdKeywords).toBeDefined();
//         expect(result.assignedSchemas).toBeDefined();
//         expect(result.documentTypeId).toBe('preset-type-id');

//         // Verify ADK used correct typeId for created keywords
//         const totalAssignments = mockActionData.keywordsToAssign.length + mockActionData.keywordsToCreate.length;
//         expect(mockSchemaService.saveNewDocumentSchema).toHaveBeenCalledTimes(totalAssignments);
//       });

//       it('should assign both existing and newly created keywords', async () => {
//         // Arrange
//         mockActionData.keywordsToCreate[0].documentTypeId = 'preset-type-id';
//         mockActionData.keywordsToCreate[1].documentTypeId = 'preset-type-id';
//         const actionString = 'CDK_ADK';
//         builder.buildFromConditions(actionString);

//         // Act
//         const result = await builder.execute(mockCredentials, mockActionData);

//         // Assert
//         const expectedTotalAssignments = mockActionData.keywordsToAssign.length + mockActionData.keywordsToCreate.length;
//         expect(result.assignedSchemas.length).toBe(expectedTotalAssignments);
//         expect(mockSchemaService.saveNewDocumentSchema).toHaveBeenCalledTimes(expectedTotalAssignments);
//       });
//     });

//     describe('CDG_CDT_CDK - Full Group to Keywords chain', () => {
//       it('should preserve context through the entire CDG_CDT_CDK chain', async () => {
//         // Arrange
//         const actionString = 'CDG_CDT_CDK';
//         builder.buildFromConditions(actionString);

//         // Act
//         const result = await builder.execute(mockCredentials, mockActionData);

//         // Assert
//         expect(result.documentGroupId).toBe('group-123');
//         expect(result.documentTypeId).toBe('type-456');
//         expect(result.createdKeywords).toBeDefined();
//         expect(result.createdKeywords.length).toBe(2);

//         // Verify chain preservation
//         expect(mockSchemaService.saveNewDocumentType).toHaveBeenCalledWith(
//           mockCredentials,
//           jasmine.objectContaining({ documentGroupId: 'group-123' })
//         );

//         mockSchemaService.saveNewKeyword.calls.all().forEach(call => {
//           expect(call.args[1]).toEqual(jasmine.objectContaining({
//             documentTypeId: 'type-456'
//           }));
//         });
//       });
//     });

//     describe('CDG_CDT_CDK_ADK - Complete workflow chain', () => {
//       it('should preserve context through the entire workflow', async () => {
//         // Arrange
//         const actionString = 'CDG_CDT_CDK_ADK';
//         builder.buildFromConditions(actionString);

//         // Act
//         const result = await builder.execute(mockCredentials, mockActionData);

//         // Assert - All context should be preserved
//         expect(result.documentGroupId).toBe('group-123');
//         expect(result.documentTypeId).toBe('type-456');
//         expect(result.createdKeywords).toBeDefined();
//         expect(result.assignedSchemas).toBeDefined();

//         // Verify complete workflow executed correctly
//         expect(mockSchemaService.saveNewDocumentGroup).toHaveBeenCalledTimes(1);
//         expect(mockSchemaService.saveNewDocumentType).toHaveBeenCalledTimes(1);
//         expect(mockSchemaService.saveNewKeyword).toHaveBeenCalledTimes(2);
        
//         const expectedAssignments = mockActionData.keywordsToAssign.length + mockActionData.keywordsToCreate.length;
//         expect(mockSchemaService.saveNewDocumentSchema).toHaveBeenCalledTimes(expectedAssignments);
//       });
//     });

//     describe('CDT_ADK - Direct DocumentType to Assignment', () => {
//       it('should preserve documentTypeId from CDT to ADK when skipping CDK', async () => {
//         // Arrange
//         const actionString = 'CDT_ADK';
//         builder.buildFromConditions(actionString);

//         // Act
//         const result = await builder.execute(mockCredentials, mockActionData);

//         // Assert
//         expect(result.documentTypeId).toBe('type-456');
//         expect(result.assignedSchemas).toBeDefined();

//         // Verify ADK used correct typeId
//         expect(mockSchemaService.saveNewDocumentSchema).toHaveBeenCalledWith(
//           mockCredentials,
//           jasmine.objectContaining({
//             documentTypeId: 'type-456'
//           })
//         );
//       });
//     });
//   });

//   describe('🚨 Error Handling and Edge Cases', () => {
    
//     it('should handle errors in CDG step without breaking context', async () => {
//       // Arrange
//       mockSchemaService.saveNewDocumentGroup.and.returnValue(throwError('Group creation failed'));
//       spyOn(ObservableHandler, 'handle').and.callFake(() => ({
//         executeAsyncClean: () => Promise.reject(new Error('Group creation failed'))
//       }));
      
//       const actionString = 'CDG_CDT';
//       builder.buildFromConditions(actionString);

//       // Act & Assert
//       await expectAsync(builder.execute(mockCredentials, mockActionData))
//         .toBeRejectedWithError('Group creation failed');
      
//       expect(mockExecutingActions.set).toHaveBeenCalledWith(false);
//     });

//     it('should handle empty keywordsToCreate array', async () => {
//       // Arrange
//       mockActionData.keywordsToCreate = [];
//       const actionString = 'CDK_ADK';
//       builder.buildFromConditions(actionString);

//       // Act
//       const result = await builder.execute(mockCredentials, mockActionData);

//       // Assert
//       expect(result.createdKeywords).toEqual([]);
//       expect(mockSchemaService.saveNewKeyword).not.toHaveBeenCalled();
//       expect(mockSchemaService.saveNewDocumentSchema).toHaveBeenCalledTimes(mockActionData.keywordsToAssign.length);
//     });

//     it('should handle unknown action codes gracefully', async () => {
//       // Arrange
//       const actionString = 'CDG_UNKNOWN_CDT';
      
//       // Act
//       builder.buildFromConditions(actionString);
//       const result = await builder.execute(mockCredentials, mockActionData);

//       // Assert - Should execute known actions and skip unknown
//       expect(result.documentGroupId).toBe('group-123');
//       expect(result.documentTypeId).toBe('type-456');
//     });
//   });

//   describe('🔄 Progress Service Integration', () => {
    
//     it('should call progress service for each step', async () => {
//       // Arrange
//       const actionString = 'CDG_CDT_CDK';
//       builder.buildFromConditions(actionString);

//       // Act
//       await builder.execute(mockCredentials, mockActionData);

//       // Assert - Progress should be updated for each step (running + completed)
//       expect(mockProgressService.updateStepProgress).toHaveBeenCalledTimes(6); // 3 steps × 2 calls each (running + completed)
      
//       // Verify progress calls for each step
//       expect(mockProgressService.updateStepProgress).toHaveBeenCalledWith(
//         0, 'running', jasmine.any(String), jasmine.any(Object)
//       );
//       expect(mockProgressService.updateStepProgress).toHaveBeenCalledWith(
//         0, 'completed', jasmine.stringContaining('group-123'), jasmine.any(Object)
//       );
//     });

//     it('should update progress with error status on failure', async () => {
//       // Arrange
//       mockSchemaService.saveNewDocumentType.and.returnValue(throwError('Type creation failed'));
//       spyOn(ObservableHandler, 'handle').and.callFake((observable) => {
//         if (observable === mockSchemaService.saveNewDocumentType.calls.mostRecent()?.returnValue) {
//           return {
//             executeAsyncClean: () => Promise.reject(new Error('Type creation failed'))
//           };
//         }
//         return {
//           executeAsyncClean: () => Promise.resolve({ data: { groupId: 'group-123' } })
//         };
//       });

//       const actionString = 'CDG_CDT';
//       builder.buildFromConditions(actionString);

//       // Act & Assert
//       await expectAsync(builder.execute(mockCredentials, mockActionData))
//         .toBeRejectedWithError('Type creation failed');

//       // Verify error progress update
//       expect(mockProgressService.updateStepProgress).toHaveBeenCalledWith(
//         1, 'error', jasmine.stringContaining('Failed to create document type'), null, jasmine.any(Error)
//       );
//     });
//   });

//   describe('📊 Performance and State Management', () => {
    
//     it('should set executingActions to true during execution and false after', async () => {
//       // Arrange
//       const actionString = 'CDG';
//       builder.buildFromConditions(actionString);

//       // Act
//       await builder.execute(mockCredentials, mockActionData);

//       // Assert
//       expect(mockExecutingActions.set).toHaveBeenCalledWith(true);
//       expect(mockExecutingActions.set).toHaveBeenCalledWith(false);
//     });

//     it('should set executingActions to false even on error', async () => {
//       // Arrange
//       mockSchemaService.saveNewDocumentGroup.and.returnValue(throwError('Execution failed'));
//       spyOn(ObservableHandler, 'handle').and.callFake(() => ({
//         executeAsyncClean: () => Promise.reject(new Error('Execution failed'))
//       }));

//       const actionString = 'CDG';
//       builder.buildFromConditions(actionString);

//       // Act & Assert
//       await expectAsync(builder.execute(mockCredentials, mockActionData))
//         .toBeRejectedWithError('Execution failed');

//       expect(mockExecutingActions.set).toHaveBeenCalledWith(true);
//       expect(mockExecutingActions.set).toHaveBeenCalledWith(false);
//     });

//     it('should execute steps in correct sequential order', async () => {
//       // Arrange
//       const executionOrder: string[] = [];
      
//       // Override the ObservableHandler to track execution order
//       spyOn(ObservableHandler, 'handle').and.callFake((observable: any) => ({
//         executeAsyncClean: async () => {
//           if (observable === mockSchemaService.saveNewDocumentGroup.calls.mostRecent()?.returnValue) {
//             executionOrder.push('CDG');
//             return { data: { groupId: 'group-123' } };
//           }
//           if (observable === mockSchemaService.saveNewDocumentType.calls.mostRecent()?.returnValue) {
//             executionOrder.push('CDT');
//             return { data: { documentTypeId: 'type-456' } };
//           }
//           if (observable === mockSchemaService.saveNewKeyword.calls.mostRecent()?.returnValue) {
//             executionOrder.push('CDK');
//             return { data: { id: `keyword-${executionOrder.length}` } };
//           }
//           return { data: {} };
//         }
//       }));

//       const actionString = 'CDG_CDT_CDK';
//       builder.buildFromConditions(actionString);

//       // Act
//       await builder.execute(mockCredentials, mockActionData);

//       // Assert
//       expect(executionOrder).toEqual(['CDG', 'CDT', 'CDK', 'CDK']); // CDK called twice for 2 keywords
//     });
//   });
// });