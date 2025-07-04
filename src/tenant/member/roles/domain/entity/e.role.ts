import { ABaseEntity } from "@core/system/abstract/a.base-entity";
import { IRole } from "../interface/i.role";

export class ERole extends ABaseEntity<'RoleDto', IRole.DTO, IRole.EntityRaw> implements IRole.EntityRaw {
  override object = 'RoleDto' as const;
  name!: string;
  isOwner!: boolean;
  permissions!: IRole.Permission[];

  public override toDTO(): IRole.DTO {
    return ERole.toDTO(this);
  }

  public static toDTO(data: IRole.EntityRaw): IRole.DTO {
    return {
      _id: data._id,
      state: data.state,
      stateHistory: data.stateHistory,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      object: data.object,
      _version: data._version,
      name: data.name,
      isOwner: data.isOwner,
      permissions: data.permissions,
    };
  }

  public static fromDTO(data: IRole.DTO): ERole {
    return new ERole(data);
  }

  public static fromRaw(data: IRole.EntityRaw): ERole {
    return new ERole(data);
  }
}

export default ERole;
