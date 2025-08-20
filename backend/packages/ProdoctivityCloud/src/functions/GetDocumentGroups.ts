import { Credentials, DocumentGroup } from "packages/Core/src";

export interface CloudDocumentType {
    documentTypeVersionId: string
    documentTypeId: string
    documentGroupId: string
    documentGroupName: string
    name: string
    acceptedMimeTypeList: string[]
    templateVersionId?: string
    templateId?: string
}


export const GetDocumentGroup = async (credential: Credentials): Promise<any> => {
    try {

        const updateInSet = <T>(
            set: Set<T>,
            predicate: (item: T) => boolean,
            updater: (item: T) => void
        ): boolean => {
            if (!set) {
                return false
            }
            for (const item of set) {
                if (predicate(item)) {
                    updater(item); // Mutate the object directly
                    return true; // Found and updated
                }
            }
            return false
        }

        const groupData = (documentTypes: CloudDocumentType[]) => {
            let documentGroup: Set<DocumentGroup> = new Set<DocumentGroup>()

            documentTypes.forEach((document) => {
                const updated = updateInSet(
                    documentGroup,
                    (item) => item.groupId === document.documentGroupId,
                    (item) => item.documentTypesCounter++
                );

                if (!updated) {
                    documentGroup.add({
                        groupId: document.documentGroupId,
                        groupName: document.documentGroupName,
                        documentTypesCounter: 1
                    });
                }
            });
            return documentGroup;
        }



        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${credential.token}`)

        const requestOptions: RequestInit = {
            method: "GET",
            headers: headers,
            //body: JSON.stringify(request),
            redirect: "follow"
        };

        const response = await fetch(`${credential.serverInformation.server}/api/document-types/all`, requestOptions);
        if (!response.ok) {
            throw new Error(`Login failed with status ${response.status}: ${response.statusText}`);
        }

        const body:{documentTypes: CloudDocumentType[]} = await response.json();

        if (response.status === 200) {
            return groupData(body.documentTypes);
        }

        return new Set<DocumentGroup>();
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw para que el llamador maneje el error
    }



}


