import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import * as argon2 from 'argon2'

import * as dto from '../dto/user.dto'
import { User, UserRole } from '../entities/user.entity'
import { plainToClass } from 'class-transformer'
import { Brand } from '@app/brand/entities/brand.entity'

@Injectable()
export class UserService {
  tableName = 'user'

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id })
  }

  async findByIdOrFail(id: number): Promise<User> {
    return await this.userRepository.findOneByOrFail({ id })
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email })
  }

  async isEmailExists(email: string): Promise<boolean> {
    return !!(await this.userRepository.findOneBy({ email }))
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

  async addBrand(user: User, brand: Brand): Promise<User> {
    const brands = await user.brands
    if (!brands.find((item) => item.id === brand.id)) {
      user.brands = Promise.resolve([...brands, brand])
      await this.userRepository.save(user)
    }
    return user
  }

  async removeBrand(user: User, brand: Brand): Promise<User> {
    const brands = await user.brands
    const withoutSelected = brands.filter((item) => item.id !== brand.id)
    user.brands = Promise.resolve(withoutSelected)
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

  async create(input: dto.UserCreateInput) {
    const record = await this.userRepository.create()

    return this.update(record, input)
  }

  async update(record: User, input: dto.UserUpdateInput) {
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

  async delete(record: User) {
    await this.userRepository.remove(record)
  }

  async paginate(
    args: dto.UserPaginateArgs
  ): Promise<dto.UserPaginateResponse> {
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
    sort: dto.UserSort[]
  ): Promise<SelectQueryBuilder<User>> {
    for (const value of sort) {
      let arr = value.split('_') as [string, 'ASC' | 'DESC']
      qb.orderBy(`${this.tableName}.${arr[0]}`, arr[1])
    }
    return qb
  }

  applyFilter(
    qb: SelectQueryBuilder<User>,
    filter: dto.UserFilter
  ): SelectQueryBuilder<User> {
    let classFilter = plainToClass(dto.UserFilter, filter)
    classFilter.applyFilter(this.tableName, qb)
    return qb
  }
}
