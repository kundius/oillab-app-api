import { File } from '@app/file/file.entity'
import { Report } from '@app/report/entities/report.entity'
import { User, UserRole } from '@app/user/entities/user.entity'
import { Vehicle } from '@app/vehicle/entities/vehicle.entity'
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects
} from '@casl/ability'
import { Injectable } from '@nestjs/common'

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

type Subjects =
  | InferSubjects<typeof File | typeof User | typeof Vehicle | typeof Report>
  | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>)

    if (user.role === UserRole.Administrator) {
      can(Action.Manage, 'all')
    } else {
      can(Action.Read, 'all')
    }

    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>
    })
  }
}
