import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository, SelectQueryBuilder } from 'typeorm'

import * as dto from '../dto/result.dto'
import { ResultIndicator } from '../entities/result-indicator.entity'
import { Result } from '../entities/result.entity'
import { OilTypeIndicatorService } from './oil-type-indicator.service'
import { OilTypeService } from './oil-type.service'

@Injectable()
export class ResultService {
  tableName = 'result'

  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    @InjectRepository(ResultIndicator)
    private readonly resultIndicatorRepository: Repository<ResultIndicator>,
    private readonly oilTypeIndicatorService: OilTypeIndicatorService,
    private readonly oilTypeService: OilTypeService
  ) {}

  async findById(id: number): Promise<Result | undefined> {
    return await this.resultRepository.findOne(id)
  }

  async findByIdOrFail(id: number): Promise<Result> {
    return await this.resultRepository.findOneOrFail(id)
  }

  async create(input: dto.ResultCreateInput) {
    const record = await this.resultRepository.create()
    record.oilType = Promise.resolve(
      await this.oilTypeService.findByIdOrFail(input.oilTypeId)
    )
    record.number = input.number
    await this.resultRepository.save(record)
    return record
  }

  async update(record: Result, input: dto.ResultUpdateInput) {
    for (const row of input.values) {
      const oilTypeIndicator = await this.oilTypeIndicatorService.findById(row.oilTypeIndicatorId)
      if (!oilTypeIndicator) continue
      let indicator = await this.resultIndicatorRepository.findOne({
        where: {
          oilTypeIndicator: {
            id: oilTypeIndicator.id
          },
          result: {
            id: record.id
          }
        }
      })
      if (!indicator) {
        indicator = await this.resultIndicatorRepository.create()
        indicator.oilTypeIndicator = Promise.resolve(oilTypeIndicator)
        indicator.result = Promise.resolve(record)
        await this.resultIndicatorRepository.save(indicator)
      }
      indicator.value = row.value
      await this.resultIndicatorRepository.save(indicator)
    }
    return record
  }

  async delete(record: Result) {
    await this.resultRepository.remove(record)
  }

  async paginate(
    args: dto.ResultPaginateArgs
  ): Promise<dto.ResultPaginateResponse> {
    const { page, perPage, filter, sort } = args

    const qb = this.resultRepository.createQueryBuilder('result')

    qb.leftJoinAndSelect('result.oilType', 'oilType')

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
    qb: SelectQueryBuilder<Result>,
    sort: dto.ResultSort[]
  ): Promise<SelectQueryBuilder<Result>> {
    for (const value of sort) {
      let arr = value.split('_') as [string, 'ASC' | 'DESC']
      qb.orderBy(`${this.tableName}.${arr[0]}`, arr[1])
    }
    return qb
  }

  applyFilter(
    qb: SelectQueryBuilder<Result>,
    filter: dto.ResultFilter
  ): SelectQueryBuilder<Result> {
    let classFilter = plainToClass(dto.ResultFilter, filter)
    classFilter.applyFilter(this.tableName, qb)
    return qb
  }
}
