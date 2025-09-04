import { ActionConditions } from './ActionConditions';

/**
 * Constructor de strings de acciones basado en condiciones
 */

export class ActionStringBuilder {
  /**
   * Construye dinámicamente el string de acciones basado en las condiciones
   */
  static build(conditions: ActionConditions): string | null {
    const actions: string[] = [];

    if (conditions.needsGroup) {
      actions.push('CDG'); // Create Document Group
    }

    if (conditions.needsType) {
      actions.push('CDT'); // Create Document Type
    }

    if (conditions.needsCreateKeywords) {
      actions.push('CDK'); // Create Document Keyword
    }

    if (conditions.needsAssignKeywords) {
      actions.push('ADK'); // Assign Document Keywords
    }

    if (actions.length === 0) {
      return null;
    }

    const actionString = actions.join('_');
    //console.log(`🔧 Built action string: ${actionString} (${this.getDescription(actionString)})`);
    return actionString;
  }

  /**
   * Obtiene una descripción legible del string de acciones
   */
  static getDescription(actionString: string): string {
    const descriptions = {
      CDG: 'Create Group',
      CDT: 'Create Type',
      CDK: 'Create Keywords',
      ADK: 'Assign Keywords',
    };

    return actionString
      .split('_')
      .map((action) => descriptions[action] || action)
      .join(' → ');
  }
}
