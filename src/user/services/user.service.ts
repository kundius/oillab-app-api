import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import * as argon2 from 'argon2'
import { ok, err, Result } from 'neverthrow'

import { ContextService } from '@app/context/context.service'

import { User, UserRole } from '../entities/user.entity'
import * as types from '../user.types'
import * as errors from '../user.errors'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly contextService: ContextService
  ) {}

  async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne(id)
  }

  async findByIdOrFail(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail(id)
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ email })
  }

  async isEmailExists(email: string): Promise<boolean> {
    return !!(await this.userRepository.findOne({ email }))
  }

  async updateLastActivity(user: User): Promise<void> {
    user.lastActivityAt = new Date()
    await this.userRepository.save(user)
  }

  async activateUser(user: User): Promise<User> {
    user.isActive = true
    await this.userRepository.save(user)
    return user
  }

  async deactivateUser(user: User): Promise<User> {
    user.isActive = false
    await this.userRepository.save(user)
    return user
  }

  async removeUser(user: User): Promise<void> {
    await this.userRepository.remove(user)
  }

  async generatePasswordHash(password: string): Promise<string> {
    return await argon2.hash(password)
  }

  async checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password)
    } catch {
      return false
    }
  }

  async create(
    input: types.UserCreateInput
  ): Promise<Result<User, types.UserCreateErrors>> {
    const currentUser = this.contextService.getCurrentUser()
    if (currentUser.role !== UserRole.Administrator) {
      return err(new errors.UserCreateNotAllowedError())
    }

    const record = await this.userRepository.create()
    record.name = input.name
    record.email = input.email
    record.password = await this.generatePasswordHash(input.password)

    await this.userRepository.save(record)

    return ok(record)
  }

  async update(
    recordId: number,
    input: types.UserUpdateInput
  ): Promise<Result<User, types.UserUpdateErrors>> {
    const record = await this.findById(recordId)
    if (!record) {
      return err(new errors.UserNotFoundError(record.id))
    }

    const currentUser = this.contextService.getCurrentUser()
    if (currentUser?.role !== UserRole.Administrator) {
      return err(new errors.UserUpdateNotAllowedError(record.id))
    }

    if (typeof input.name !== 'undefined') {
      record.name = input.name
    }

    if (typeof input.email !== 'undefined') {
      record.email = input.email
    }

    if (typeof input.password !== 'undefined') {
      record.password = await this.generatePasswordHash(input.password)
    }

    await this.userRepository.save(record)

    return ok(record)
  }

  async delete(
    recordId: number
  ): Promise<Result<void, types.UserDeleteErrors>> {
    const record = await this.findById(recordId)
    if (!record) {
      return err(new errors.UserNotFoundError(record.id))
    }

    const currentUser = this.contextService.getCurrentUser()
    if (currentUser?.role !== UserRole.Administrator) {
      return err(new errors.UserDeleteNotAllowedError(record.id))
    }

    await this.userRepository.remove(record)

    return ok(undefined)
  }

  async paginate(
    args: types.UserPaginateArgs
  ): Promise<types.UserPaginatedResult> {
    const { page, perPage, filter, sort } = args

    const qb = this.userRepository.createQueryBuilder('user')

    if (filter) {
      await this.applyFilter(qb, filter)
    }

    if (sort) {
      await this.applySort(qb, sort)
    }

    const total = await qb.getCount()
    const items = await qb
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany()

    return {
      items,
      pageInfo: {
        total,
        page,
        perPage
      }
    }
  }

  async applySort(
    qb: SelectQueryBuilder<User>,
    sort: types.UserSort[]
  ): Promise<SelectQueryBuilder<User>> {
    for (const value of sort) {
      switch (value) {
        case types.UserSort.ID_ASC:
          qb.orderBy('user.id', 'ASC')
          break
        case types.UserSort.ID_DESC:
          qb.orderBy('user.id', 'DESC')
          break
        case types.UserSort.NAME_ASC:
          qb.orderBy('user.name', 'ASC')
          break
        case types.UserSort.NAME_DESC:
          qb.orderBy('user.name', 'DESC')
          break
        case types.UserSort.EMAIL_ASC:
          qb.orderBy('user.email', 'ASC')
          break
        case types.UserSort.EMAIL_DESC:
          qb.orderBy('user.email', 'DESC')
          break
        default:
          throw new Error('Not implemented')
      }
    }
    return qb
  }

  async applyFilter(
    qb: SelectQueryBuilder<User>,
    filter: types.UserFilter
  ): Promise<SelectQueryBuilder<User>> {
    if (filter.name) {
      if (filter.name.eq) {
        qb.andWhere('user.name LIKE :nameEq', { nameEq: filter.name.eq })
      }
      if (filter.name.contains) {
        qb.andWhere('user.name LIKE :nameContains', {
          nameContains: `%${filter.name.contains}%`
        })
      }
    }
    if (filter.email) {
      if (filter.email.eq) {
        qb.andWhere('user.email LIKE :emailEq', { emailEq: filter.email.eq })
      }
      if (filter.email.contains) {
        qb.andWhere('user.email LIKE :emailContains', {
          emailContains: `%${filter.email.contains}%`
        })
      }
    }
    return qb
  }
}
