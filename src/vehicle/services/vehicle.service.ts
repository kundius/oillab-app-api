import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { UserService } from '@app/user/services/user.service'

import * as dto from '../dto/vehicle.dto'
import { Vehicle } from '../entities/vehicle.entity'

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly userService: UserService
  ) {}

  async findById(id: string): Promise<Vehicle | undefined> {
    return await this.vehicleRepository.findOne(id)
  }

  async findByIdOrFail(id: string): Promise<Vehicle> {
    return await this.vehicleRepository.findOneOrFail(id)
  }

  async create(input: dto.VehicleCreateInput) {
    const owner = await this.userService.findByIdOrFail(input.owner)
    const record = await this.vehicleRepository.create()
    record.engineModel = input.engineModel
    record.generalOperatingTime = input.generalOperatingTime
    record.model = input.model
    record.owner = Promise.resolve(owner)
    record.releaseYear = input.releaseYear
    record.stateNumber = input.stateNumber
    await this.vehicleRepository.save(record)
    return record
  }

  async update(record: Vehicle, input: dto.VehicleUpdateInput) {
    if (typeof input.engineModel !== 'undefined') {
      record.engineModel = input.engineModel
    }
    if (typeof input.generalOperatingTime !== 'undefined') {
      record.generalOperatingTime = input.generalOperatingTime
    }
    if (typeof input.model !== 'undefined') {
      record.model = input.model
    }
    if (typeof input.releaseYear !== 'undefined') {
      record.releaseYear = input.releaseYear
    }
    if (typeof input.stateNumber !== 'undefined') {
      record.stateNumber = input.stateNumber
    }
    if (typeof input.owner !== 'undefined') {
      const owner = await this.userService.findByIdOrFail(input.owner)
      record.owner = Promise.resolve(owner)
    }
    await this.vehicleRepository.save(record)
    return record
  }

  async delete(record: Vehicle) {
    await this.vehicleRepository.remove(record)
  }

  async paginate(
    args: dto.VehiclePaginateArgs
  ): Promise<dto.VehiclePaginateResponse> {
    const { page, perPage, filter, sort } = args

    const qb = this.vehicleRepository.createQueryBuilder('vehicle')

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
    qb: SelectQueryBuilder<Vehicle>,
    sort: dto.VehicleSort[]
  ): Promise<SelectQueryBuilder<Vehicle>> {
    for (const value of sort) {
      switch (value) {
        case dto.VehicleSort.MODEL_ASC:
          qb.orderBy('vehicle.model', 'ASC')
          break
        case dto.VehicleSort.MODEL_DESC:
          qb.orderBy('vehicle.model', 'DESC')
          break
        case dto.VehicleSort.ENGINE_MODEL_ASC:
          qb.orderBy('vehicle.engineModel', 'ASC')
          break
        case dto.VehicleSort.ENGINE_MODEL_DESC:
          qb.orderBy('vehicle.engineModel', 'DESC')
          break
        case dto.VehicleSort.GENERAL_OPERATING_TIME_ASC:
          qb.orderBy('vehicle.generalOperatingTime', 'ASC')
          break
        case dto.VehicleSort.GENERAL_OPERATING_TIME_DESC:
          qb.orderBy('vehicle.generalOperatingTime', 'DESC')
          break
        case dto.VehicleSort.RELEASE_YEAR_ASC:
          qb.orderBy('vehicle.releaseYear', 'ASC')
          break
        case dto.VehicleSort.RELEASE_YEAR_DESC:
          qb.orderBy('vehicle.releaseYear', 'DESC')
          break
        case dto.VehicleSort.STATE_NUMBER_ASC:
          qb.orderBy('vehicle.stateNumber', 'ASC')
          break
        case dto.VehicleSort.STATE_NUMBER_DESC:
          qb.orderBy('vehicle.stateNumber', 'DESC')
          break
        default:
          throw new Error('Not implemented')
      }
    }
    return qb
  }

  async applyFilter(
    qb: SelectQueryBuilder<Vehicle>,
    filter: dto.VehicleFilter
  ): Promise<SelectQueryBuilder<Vehicle>> {
    if (filter.engineModel) {
      if (filter.engineModel.eq) {
        qb.andWhere('vehicle.engineModel ILIKE :engineModelEq', {
          engineModelEq: filter.engineModel.eq
        })
      }
      if (filter.engineModel.contains) {
        qb.andWhere('vehicle.engineModel ILIKE :engineModelContains', {
          engineModelContains: `%${filter.engineModel.contains}%`
        })
      }
    }
    if (filter.model) {
      if (filter.model.eq) {
        qb.andWhere('vehicle.model ILIKE :modelEq', {
          modelEq: filter.model.eq
        })
      }
      if (filter.model.contains) {
        qb.andWhere('vehicle.model ILIKE :modelContains', {
          modelContains: `%${filter.model.contains}%`
        })
      }
    }
    if (filter.releaseYear) {
      if (filter.releaseYear.eq) {
        qb.andWhere('vehicle.releaseYear ILIKE :releaseYearEq', {
          releaseYearEq: filter.releaseYear.eq
        })
      }
      if (filter.releaseYear.contains) {
        qb.andWhere('vehicle.releaseYear ILIKE :releaseYearContains', {
          releaseYearContains: `%${filter.releaseYear.contains}%`
        })
      }
    }
    if (filter.stateNumber) {
      if (filter.stateNumber.eq) {
        qb.andWhere('vehicle.stateNumber ILIKE :stateNumberEq', {
          stateNumberEq: filter.stateNumber.eq
        })
      }
      if (filter.stateNumber.contains) {
        qb.andWhere('vehicle.stateNumber ILIKE :stateNumberContains', {
          stateNumberContains: `%${filter.stateNumber.contains}%`
        })
      }
    }
    if (filter.generalOperatingTime) {
      if (filter.generalOperatingTime.eq) {
        qb.andWhere(
          'vehicle.generalOperatingTime ILIKE :generalOperatingTimeEq',
          { generalOperatingTimeEq: filter.generalOperatingTime.eq }
        )
      }
      if (filter.generalOperatingTime.contains) {
        qb.andWhere(
          'vehicle.generalOperatingTime ILIKE :generalOperatingTimeContains',
          {
            generalOperatingTimeContains: `%${filter.generalOperatingTime.contains}%`
          }
        )
      }
    }
    return qb
  }
}
