/**
 * Defines permissions associated with a specific role in the system.
 * This maps a role to the set of permissions that role has been granted.
 */
export interface Permission {
  /** The unique identifier of the role */
  roleId: string;

  /** Array of permission strings granted to this role */
  permissions: string[];
}
