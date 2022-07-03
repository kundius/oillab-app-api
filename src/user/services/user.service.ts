import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import * as argon2 from 'argon2'

import * as dto from '../dto/user.dto'
import { User, UserRole } from '../entities/user.entity'

@Injectable()
export class UserService {
  tableName = 'user'

  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findById (id: number): Promise<User | undefined> {
    return await this.userRepository.findOne(id)
  }

  async findByIdOrFail (id: number): Promise<User> {
    return await this.userRepository.findOneOrFail(id)
  }

  async findByEmail (email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ email })
  }

  async isEmailExists (email: string): Promise<boolean> {
    return !!(await this.userRepository.findOne({ email }))
  }

  async updateLastActivity (user: User): Promise<void> {
    user.lastActivityAt = new Date()
    await this.userRepository.save(user)
  }

  async activateUser (user: User): Promise<User> {
    user.isActive = true
    await this.userRepository.save(user)
    return user
  }

  async deactivateUser (user: User): Promise<User> {
    user.isActive = false
    await this.userRepository.save(user)
    return user
  }

  async removeUser (user: User): Promise<void> {
    await this.userRepository.remove(user)
  }

  async generatePasswordHash (password: string): Promise<string> {
    return await argon2.hash(password)
  }

  async checkPasswordHash (password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password)
    } catch {
      return false
    }
  }

  async create (input: dto.UserCreateInput) {
    const { password, ...data } = input

    const record = await this.userRepository.create()

    return this.update(record, input)
  }

  async update (record: User, input: dto.UserUpdateInput) {
    const { password, ...data } = input

    for (let key of Object.keys(data)) {
      record[key] = data[key]
    }

    if (typeof password !== 'undefined') {
      record.password = await this.generatePasswordHash(password)
    }

    await this.userRepository.save(record)

    return record
  }

  async delete (record: User) {
    await this.userRepository.remove(record)
  }

  async paginate (args: dto.UserPaginateArgs): Promise<dto.UserPaginateResponse> {
    const { page, perPage, filter, sort } = args

    const qb = this.userRepository.createQueryBuilder('user')

    if (filter) {
      await this.applyFilter(qb, filter)
    }

    if (sort) {
      await this.applySort(qb, sort)
    }

    const total = await qb.getCount()
    const items = await qb.skip((page - 1) * perPage).take(perPage).getMany()

    return {
      items,
      pageInfo: {
        total,
        page,
        perPage
      }
    }
  }

  async applySort (
    qb: SelectQueryBuilder<User>,
    sort: dto.UserSort[]
  ): Promise<SelectQueryBuilder<User>> {
    for (const value of sort) {
      let arr = value.split('_') as [string, "ASC" | "DESC"]
      qb.orderBy(`${this.tableName}.${arr[0]}`, arr[1])
    }
    return qb
  }

  async applyFilter (
    qb: SelectQueryBuilder<User>,
    filter: dto.UserFilter
  ): Promise<SelectQueryBuilder<User>> {
    for (let key of Object.keys(filter)) {
      if (filter[key].eq) {
        qb.andWhere(`${this.tableName}.${key} LIKE :${key}Eq`, {
          [`${key}Eq`]: filter[key].eq
        })
      }
      if (filter[key].contains) {
        qb.andWhere(`${this.tableName}.${key} LIKE :${key}Contains`, {
          [`${key}Contains`]: `%${filter[key].contains}%`
        })
      }
    }
    return qb
  }
}
