import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository, SelectQueryBuilder } from 'typeorm'

import * as dto from '../dto/lubricant.dto'
import { Lubricant } from '../entities/lubricant.entity'

@Injectable()
export class LubricantService {
  tableName = 'lubricant'

  constructor(
    @InjectRepository(Lubricant)
    private readonly lubricantRepository: Repository<Lubricant>
  ) {}

  async findById(id: number): Promise<Lubricant | undefined> {
    return await this.lubricantRepository.findOne(id)
  }

  async findByIdOrFail(id: number): Promise<Lubricant> {
    return await this.lubricantRepository.findOneOrFail(id)
  }

  async create(input: dto.LubricantCreateInput) {
    const record = await this.lubricantRepository.create()
    return this.update(record, input)
  }

  async update(record: Lubricant, input: dto.LubricantUpdateInput) {
    const { productType, ...data } = input

    for (let key of Object.keys(data)) {
      record[key] = data[key]
    }

    if (typeof productType !== 'undefined') {
      record.productType = productType || null
    }

    await this.lubricantRepository.save(record)
    
    return record
  }

  async delete(record: Lubricant) {
    await this.lubricantRepository.remove(record)
  }

  async paginate(
    args: dto.LubricantPaginateArgs
  ): Promise<dto.LubricantPaginateResponse> {
    const { page, perPage, filter, sort } = args

    const qb = this.lubricantRepository.createQueryBuilder('lubricant')

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
    qb: SelectQueryBuilder<Lubricant>,
    sort: dto.LubricantSort[]
  ): Promise<SelectQueryBuilder<Lubricant>> {
    for (const value of sort) {
      let arr = value.split('_') as [string, "ASC" | "DESC"]
      qb.orderBy(`${this.tableName}.${arr[0]}`, arr[1])
    }
    return qb
  }

  applyFilter(
    qb: SelectQueryBuilder<Lubricant>,
    filter: dto.LubricantFilter
  ): SelectQueryBuilder<Lubricant> {
    let classFilter = plainToClass(dto.LubricantFilter, filter)
    classFilter.applyFilter(this.tableName, qb)
    return qb
  }
}
