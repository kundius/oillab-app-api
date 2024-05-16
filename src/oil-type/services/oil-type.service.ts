import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository, SelectQueryBuilder } from 'typeorm'

import * as dto from '../dto/oil-type.dto'
import { OilType } from '../entities/oil-type.entity'

@Injectable()
export class OilTypeService {
  tableName = 'oil_type'

  constructor(
    @InjectRepository(OilType)
    private readonly oilTypeRepository: Repository<OilType>
  ) {}

  async findById(id: number): Promise<OilType | null> {
    return await this.oilTypeRepository.findOneBy({ id })
  }

  async findByIdOrFail(id: number): Promise<OilType> {
    return await this.oilTypeRepository.findOneByOrFail({ id })
  }

  async create(input: dto.OilTypeCreateInput) {
    const record = await this.oilTypeRepository.create()
    return this.update(record, input)
  }

  async update(record: OilType, input: dto.OilTypeUpdateInput) {
    const { ...data } = input

    for (let key of Object.keys(input)) {
      record[key] = data[key]
    }

    await this.oilTypeRepository.save(record)

    return record
  }

  async delete(record: OilType) {
    await this.oilTypeRepository.remove(record)
  }

  async paginate(
    args: dto.OilTypePaginateArgs
  ): Promise<dto.OilTypePaginateResponse> {
    const { page, perPage, filter, sort } = args

    const qb = this.oilTypeRepository.createQueryBuilder('oil_type')

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
    qb: SelectQueryBuilder<OilType>,
    sort: dto.OilTypeSort[]
  ): Promise<SelectQueryBuilder<OilType>> {
    for (const value of sort) {
      let arr = value.split('_') as [string, 'ASC' | 'DESC']
      qb.orderBy(`${this.tableName}.${arr[0]}`, arr[1])
    }
    return qb
  }

  applyFilter(
    qb: SelectQueryBuilder<OilType>,
    filter: dto.OilTypeFilter
  ): SelectQueryBuilder<OilType> {
    let classFilter = plainToClass(dto.OilTypeFilter, filter)
    classFilter.applyFilter(this.tableName, qb)
    return qb
  }
}
