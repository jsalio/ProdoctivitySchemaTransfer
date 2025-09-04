import { Credentials, DocumentGroup, Result } from 'packages/Core/src';
import { CloudDocumentType } from '../types/CloudDocumentType';

export const GetDocumentGroup = async (
  credential: Credentials,
): Promise<Result<Array<DocumentGroup>, Error>> => {
  try {
    const updateInSet = <T>(
      set: Set<T>,
      predicate: (item: T) => boolean,
      updater: (item: T) => void,
    ): boolean => {
      if (!set) {
        return false;
      }
      for (const item of set) {
        if (predicate(item)) {
          updater(item); // Mutate the object directly
          return true; // Found and updated
        }
      }
      return false;
    };

    const groupData = (documentTypes: CloudDocumentType[]): Array<DocumentGroup> => {
      let documentGroup: Set<DocumentGroup> = new Set<DocumentGroup>();
      console.log('Starting groupData with', documentTypes.length, 'documents');

      documentTypes.forEach((document, index) => {
        console.log(`Document ${index}:`, {
          name: document.name,
          groupId: document.documentGroupId,
          groupName: document.documentGroupName,
        });

        const updated = updateInSet(
          documentGroup,
          (item) => {
            console.log('Comparing:', item.groupId, '===', document.documentGroupId);
            return item.groupId === document.documentGroupId;
          },
          (item) => {
            console.log('Updating counter for group:', item.groupId);
            item.documentTypesCounter++;
          },
        );

        console.log('Was updated?', updated);

        if (!updated) {
          const newGroup = {
            groupId: document.documentGroupId,
            groupName: document.documentGroupName,
            documentTypesCounter: 1,
          };
          console.log('Adding new group:', newGroup);
          documentGroup.add(newGroup);
          console.log('Set size now:', documentGroup.size);
        }
      });

      //console.log("Final set:", Array.from(documentGroup));
      // console.log(documentGroup)
      return Array.from(documentGroup.values());
      // let documentGroup: Set<DocumentGroup> = new Set<DocumentGroup>()

      // documentTypes.forEach((document) => {
      //     console.log("enter here ", document.name)
      //     const updated = updateInSet(
      //         documentGroup,
      //         (item) => item.groupId === document.documentGroupId,
      //         (item) => item.documentTypesCounter++
      //     );

      //     if (!updated) {
      //         documentGroup.add({
      //             groupId: document.documentGroupId,
      //             groupName: document.documentGroupName,
      //             documentTypesCounter: 1
      //         });
      //     }
      // });
      // return documentGroup;
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${credential.token}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: headers,
      redirect: 'follow',
    };

    const response = await fetch(
      `${credential.serverInformation.server}/api/document-types/all`,
      requestOptions,
    );
    if (!response.ok) {
      return {
        ok: false,
        error: new Error(`Login failed with status ${response.status}: ${response.statusText}`),
      };
    }

    const body: { documentTypes: CloudDocumentType[] } = await response.json();
    //console.log("Cloud response :", JSON.stringify(groupData(body.documentTypes)))

    if (response.status === 200) {
      const response: Result<Array<DocumentGroup>, Error> = {
        ok: true,
        value: groupData(body.documentTypes),
      };
      // console.log(response)
      // console.log("Is here")
      // console.log("Cloud response translation:", JSON.stringify(response))
      return response;
    }
    return {
      ok: false,
      error: new Error('No document type returned'),
    };
  } catch (error) {
    return {
      ok: false,
      error: error as Error,
    };
  }
};
