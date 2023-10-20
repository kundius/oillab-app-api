import { ResultIndicator } from '@app/result/entities/result-indicator.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository, SelectQueryBuilder } from 'typeorm'

import * as dto from '../dto/oil-type-indicator.dto'
import { OilTypeIndicator } from '../entities/oil-type-indicator.entity'
import { OilType } from '../entities/oil-type.entity'

@Injectable()
export class OilTypeIndicatorService {
  tableName = 'oil_type_indicator'

  constructor(
    @InjectRepository(OilType)
    private readonly oilTypeRepository: Repository<OilType>,
    @InjectRepository(OilTypeIndicator)
    private readonly oilTypeIndicatorRepository: Repository<OilTypeIndicator>,
  ) {}

  async findById(id: number): Promise<OilTypeIndicator | undefined> {
    return await this.oilTypeIndicatorRepository.findOne(id)
  }

  async findByIdOrFail(id: number): Promise<OilTypeIndicator> {
    return await this.oilTypeIndicatorRepository.findOneOrFail(id)
  }

  async create(oilType: OilType, input: dto.OilTypeIndicatorCreateInput) {
    const record = await this.oilTypeIndicatorRepository.create()
    record.oilType = Promise.resolve(oilType)
    return this.update(record, input)
  }

  async update(record: OilTypeIndicator, input: dto.OilTypeIndicatorUpdateInput) {
    const { ...data } = input

    for (let key of Object.keys(input)) {
      record[key] = data[key]
    }

    await this.oilTypeIndicatorRepository.save(record)
    
    return record
  }

  async delete(record: OilTypeIndicator) {
    for (const resultIndicator of await record.resultIndicators) {
      await ResultIndicator.remove(resultIndicator)
    }
    await this.oilTypeIndicatorRepository.remove(record)
  }

  async list(
    args: dto.OilTypeIndicatorListArgs
  ): Promise<dto.OilTypeIndicatorListResponse> {
    const qb = this.oilTypeIndicatorRepository.createQueryBuilder('oil_type_indicator')

    qb.leftJoinAndSelect('oil_type_indicator.oilType', 'oilType')
    qb.where('oil_type_indicator.oilType = :oilTypeId', { oilTypeId: args.oilTypeId })

    const items = await qb.getMany()

    return {
      items
    }
  }
}
