import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { UserService } from '@app/user/services/user.service'
import { VehicleService } from '@app/vehicle/services/vehicle.service'

import * as dto from '../dto/report.dto'
import { Report } from '../entities/report.entity'

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService
  ) {}

  async findById(id: string): Promise<Report | undefined> {
    return await this.reportRepository.findOne(id)
  }

  async findByIdOrFail(id: string): Promise<Report> {
    return await this.reportRepository.findOneOrFail(id)
  }

  async create(input: dto.ReportCreateInput) {
    const client = await this.userService.findByIdOrFail(input.client)
    const vehicle = await this.vehicleService.findByIdOrFail(input.vehicle)
    const record = await this.reportRepository.create()
    record.lubricant = input.lubricant
    record.stateNumber = input.stateNumber
    record.totalMileage = input.totalMileage
    record.lubricantMileage = input.lubricantMileage
    record.samplingNodes = input.samplingNodes
    record.note = input.note || null
    record.client = Promise.resolve(client)
    record.vehicle = Promise.resolve(vehicle)
    record.sampledAt = input.sampledAt
    await this.reportRepository.save(record)
    return record
  }

  async update(record: Report, input: dto.ReportUpdateInput) {
    if (typeof input.lubricant !== 'undefined') {
      record.lubricant = input.lubricant
    }
    if (typeof input.stateNumber !== 'undefined') {
      record.stateNumber = input.stateNumber
    }
    if (typeof input.totalMileage !== 'undefined') {
      record.totalMileage = input.totalMileage
    }
    if (typeof input.lubricantMileage !== 'undefined') {
      record.lubricantMileage = input.lubricantMileage
    }
    if (typeof input.samplingNodes !== 'undefined') {
      record.samplingNodes = input.samplingNodes
    }
    if (typeof input.note !== 'undefined') {
      record.note = input.note
    }
    if (typeof input.sampledAt !== 'undefined') {
      record.sampledAt = input.sampledAt
    }
    if (typeof input.client !== 'undefined') {
      const client = await this.userService.findByIdOrFail(input.client)
      record.client = Promise.resolve(client)
    }
    if (typeof input.vehicle !== 'undefined') {
      const vehicle = await this.vehicleService.findByIdOrFail(input.vehicle)
      record.vehicle = Promise.resolve(vehicle)
    }
    await this.reportRepository.save(record)
    return record
  }

  async delete(record: Report) {
    await this.reportRepository.remove(record)
  }

  async paginate(
    args: dto.ReportPaginateArgs
  ): Promise<dto.ReportPaginateResponse> {
    const { page, perPage, filter, sort } = args

    const qb = this.reportRepository.createQueryBuilder('report')

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
    qb: SelectQueryBuilder<Report>,
    sort: dto.ReportSort[]
  ): Promise<SelectQueryBuilder<Report>> {
    for (const value of sort) {
      switch (value) {
        case dto.ReportSort.LUBRICANT_ASC:
          qb.orderBy('report.lubricant', 'ASC')
          break
        case dto.ReportSort.LUBRICANT_DESC:
          qb.orderBy('report.lubricant', 'DESC')
          break
        case dto.ReportSort.LUBRICANT_MILEAGE_ASC:
          qb.orderBy('report.lubricantMileage', 'ASC')
          break
        case dto.ReportSort.LUBRICANT_MILEAGE_DESC:
          qb.orderBy('report.lubricantMileage', 'DESC')
          break
        case dto.ReportSort.SAMPLED_AT_ASC:
          qb.orderBy('report.sampledAt', 'ASC')
          break
        case dto.ReportSort.SAMPLED_AT_DESC:
          qb.orderBy('report.sampledAt', 'DESC')
          break
        case dto.ReportSort.SAMPLING_NODES_ASC:
          qb.orderBy('report.samplingNodes', 'ASC')
          break
        case dto.ReportSort.SAMPLING_NODES_DESC:
          qb.orderBy('report.samplingNodes', 'DESC')
          break
        case dto.ReportSort.STATE_NUMBER_ASC:
          qb.orderBy('report.stateNumber', 'ASC')
          break
        case dto.ReportSort.STATE_NUMBER_DESC:
          qb.orderBy('report.stateNumber', 'DESC')
          break
        case dto.ReportSort.TOTAL_MILEAGE_ASC:
          qb.orderBy('report.totalMileage', 'ASC')
          break
        case dto.ReportSort.TOTAL_MILEAGE_DESC:
          qb.orderBy('report.totalMileage', 'DESC')
          break
        default:
          throw new Error('Not implemented')
      }
    }
    return qb
  }

  async applyFilter(
    qb: SelectQueryBuilder<Report>,
    filter: dto.ReportFilter
  ): Promise<SelectQueryBuilder<Report>> {
    if (filter.lubricant) {
      if (filter.lubricant.eq) {
        qb.andWhere('report.lubricant ILIKE :lubricantEq', { lubricantEq: filter.lubricant.eq })
      }
      if (filter.lubricant.contains) {
        qb.andWhere('report.lubricant ILIKE :lubricantContains', {
          lubricantContains: `%${filter.lubricant.contains}%`
        })
      }
    }
    if (filter.stateNumber) {
      if (filter.stateNumber.eq) {
        qb.andWhere('report.stateNumber ILIKE :stateNumberEq', { stateNumberEq: filter.stateNumber.eq })
      }
      if (filter.stateNumber.contains) {
        qb.andWhere('report.stateNumber ILIKE :stateNumberContains', {
          stateNumberContains: `%${filter.stateNumber.contains}%`
        })
      }
    }
    if (filter.totalMileage) {
      if (filter.totalMileage.eq) {
        qb.andWhere('report.totalMileage ILIKE :totalMileageEq', { totalMileageEq: filter.totalMileage.eq })
      }
      if (filter.totalMileage.contains) {
        qb.andWhere('report.totalMileage ILIKE :totalMileageContains', {
          totalMileageContains: `%${filter.totalMileage.contains}%`
        })
      }
    }
    if (filter.lubricantMileage) {
      if (filter.lubricantMileage.eq) {
        qb.andWhere('report.lubricantMileage ILIKE :lubricantMileageEq', { lubricantMileageEq: filter.lubricantMileage.eq })
      }
      if (filter.lubricantMileage.contains) {
        qb.andWhere('report.lubricantMileage ILIKE :lubricantMileageContains', {
          lubricantMileageContains: `%${filter.lubricantMileage.contains}%`
        })
      }
    }
    if (filter.samplingNodes) {
      if (filter.samplingNodes.eq) {
        qb.andWhere('report.samplingNodes ILIKE :samplingNodesEq', { samplingNodesEq: filter.samplingNodes.eq })
      }
      if (filter.samplingNodes.contains) {
        qb.andWhere('report.samplingNodes ILIKE :samplingNodesContains', {
          samplingNodesContains: `%${filter.samplingNodes.contains}%`
        })
      }
    }
    if (filter.sampledAt) {
      if (filter.sampledAt.eq) {
        qb.andWhere('report.sampledAt ILIKE :sampledAtEq', { sampledAtEq: filter.sampledAt.eq })
      }
      if (filter.sampledAt.contains) {
        qb.andWhere('report.sampledAt ILIKE :sampledAtContains', {
          sampledAtContains: `%${filter.sampledAt.contains}%`
        })
      }
    }
    return qb
  }
}
