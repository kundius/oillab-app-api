import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository, SelectQueryBuilder } from 'typeorm'

import * as dto from '../dto/oil-type-research.dto'
import { OilTypeResearch } from '../entities/oil-type-research.entity'
import { OilType } from '../entities/oil-type.entity'

@Injectable()
export class OilTypeResearchService {
  tableName = 'oil_type_research'

  constructor(
    @InjectRepository(OilType)
    private readonly oilTypeRepository: Repository<OilType>,
    @InjectRepository(OilTypeResearch)
    private readonly oilTypeResearchRepository: Repository<OilTypeResearch>
  ) {}

  async findById(id: number): Promise<OilTypeResearch | undefined> {
    return await this.oilTypeResearchRepository.findOne(id)
  }

  async findByIdOrFail(id: number): Promise<OilTypeResearch> {
    return await this.oilTypeResearchRepository.findOneOrFail(id)
  }

  async create(oilType: OilType, input: dto.OilTypeResearchCreateInput) {
    const record = await this.oilTypeResearchRepository.create()
    record.oilType = Promise.resolve(oilType)
    return this.update(record, input)
  }

  async update(record: OilTypeResearch, input: dto.OilTypeResearchUpdateInput) {
    const { ...data } = input

    for (let key of Object.keys(input)) {
      record[key] = data[key]
    }

    await this.oilTypeResearchRepository.save(record)
    
    return record
  }

  async delete(record: OilTypeResearch) {
    await this.oilTypeResearchRepository.remove(record)
  }

  async list(
    args: dto.OilTypeResearchListArgs
  ): Promise<dto.OilTypeResearchListResponse> {
    const qb = this.oilTypeResearchRepository.createQueryBuilder('oil_type_research')

    qb.leftJoinAndSelect('oil_type_research.oilType', 'oilType')
    qb.where('oil_type_research.oilType = :oilTypeId', { oilTypeId: args.oilTypeId })

    const items = await qb.getMany()

    return {
      items
    }
  }
}
