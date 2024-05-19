import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository, SelectQueryBuilder } from 'typeorm'
import * as dto from '../dto/brand.dto'
import { Brand } from '../entities/brand.entity'

@Injectable()
export class BrandService {
  tableName = 'brand'

  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>
  ) {}

  async findById(id: number): Promise<Brand | null> {
    return await this.brandRepository.findOneBy({ id })
  }

  async create(input: dto.BrandCreateInput) {
    const record = await this.brandRepository.create()
    record.name = input.name
    await this.brandRepository.save(record)
    return record
  }

  async update(record: Brand, input: dto.BrandUpdateInput) {
    if (typeof input.name !== 'undefined') {
      record.name = input.name
    }
    await this.brandRepository.save(record)
    return record
  }

  async delete(record: Brand) {
    await this.brandRepository.remove(record)
  }

  async paginate(
    args: dto.BrandPaginateArgs
  ): Promise<dto.BrandPaginateResponse> {
    const { page, perPage, filter, sort } = args

    const qb = this.brandRepository.createQueryBuilder('brand')

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
    qb: SelectQueryBuilder<Brand>,
    sort: dto.BrandSort[]
  ): Promise<SelectQueryBuilder<Brand>> {
    for (const value of sort) {
      let arr = value.split('_') as [string, 'ASC' | 'DESC']
      qb.orderBy(`${this.tableName}.${arr[0]}`, arr[1])
    }
    return qb
  }

  applyFilter(
    qb: SelectQueryBuilder<Brand>,
    filter: dto.BrandFilter
  ): SelectQueryBuilder<Brand> {
    let classFilter = plainToClass(dto.BrandFilter, filter)
    classFilter.applyFilter(this.tableName, qb)
    return qb
  }
}
