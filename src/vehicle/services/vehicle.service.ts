import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { ok, err, Result } from 'neverthrow'

import { UserService } from '@app/user/services/user.service'
import { ContextService } from '@app/context/context.service'
import { UserRole } from '@app/user/entities/user.entity'

import { Vehicle } from '../entities/vehicle.entity'
import * as types from '../vehicle.types'
import * as errors from '../vehicle.errors'

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly userService: UserService,
    // private readonly contextService: ContextService
  ) {
    console.log('init VehicleService')
  }

  async findById(id: number): Promise<Vehicle | undefined> {
    return await this.vehicleRepository.findOne(id)
  }

  async findByIdOrFail(id: number): Promise<Vehicle> {
    return await this.vehicleRepository.findOneOrFail(id)
  }

  async create(
    input: types.VehicleCreateInput
  ): Promise<Result<Vehicle, types.VehicleCreateErrors>> {
    // const currentUser = this.contextService.getCurrentUser()
    // if (currentUser.role !== UserRole.Administrator) {
    //   return err(new errors.VehicleCreateNotAllowedError())
    // }

    const owner = await this.userService.findByIdOrFail(input.owner)
    const record = await this.vehicleRepository.create()

    record.engineModel = input.engineModel
    record.model = input.model
    record.owner = Promise.resolve(owner)
    record.releaseYear = input.releaseYear
    record.stateNumber = input.stateNumber

    await this.vehicleRepository.save(record)

    return ok(record)
  }

  async update(
    recordId: number,
    input: types.VehicleUpdateInput
  ): Promise<Result<Vehicle, types.VehicleUpdateErrors>> {
    const record = await this.findById(recordId)
    if (!record) {
      return err(new errors.VehicleNotFoundError(record.id))
    }

    // const currentUser = this.contextService.getCurrentUser()
    // if (currentUser?.role !== UserRole.Administrator) {
    //   return err(new errors.VehicleUpdateNotAllowedError(record.id))
    // }

    if (typeof input.engineModel !== 'undefined') {
      record.engineModel = input.engineModel
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

    return ok(record)
  }

  async delete(
    recordId: number
  ): Promise<Result<void, types.VehicleDeleteErrors>> {
    const record = await this.findById(recordId)
    if (!record) {
      return err(new errors.VehicleNotFoundError(record.id))
    }

    // const currentUser = this.contextService.getCurrentUser()
    // if (currentUser?.role !== UserRole.Administrator) {
    //   return err(new errors.VehicleDeleteNotAllowedError(record.id))
    // }

    await this.vehicleRepository.remove(record)

    return ok(undefined)
  }

  async paginate(
    args: types.VehiclePaginateArgs
  ): Promise<types.VehiclePaginatedResult> {
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
    sort: types.VehicleSort[]
  ): Promise<SelectQueryBuilder<Vehicle>> {
    for (const value of sort) {
      switch (value) {
        case types.VehicleSort.MODEL_ASC:
          qb.orderBy('vehicle.model', 'ASC')
          break
        case types.VehicleSort.MODEL_DESC:
          qb.orderBy('vehicle.model', 'DESC')
          break
        case types.VehicleSort.ENGINE_MODEL_ASC:
          qb.orderBy('vehicle.engineModel', 'ASC')
          break
        case types.VehicleSort.ENGINE_MODEL_DESC:
          qb.orderBy('vehicle.engineModel', 'DESC')
          break
        case types.VehicleSort.RELEASE_YEAR_ASC:
          qb.orderBy('vehicle.releaseYear', 'ASC')
          break
        case types.VehicleSort.RELEASE_YEAR_DESC:
          qb.orderBy('vehicle.releaseYear', 'DESC')
          break
        case types.VehicleSort.STATE_NUMBER_ASC:
          qb.orderBy('vehicle.stateNumber', 'ASC')
          break
        case types.VehicleSort.STATE_NUMBER_DESC:
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
    filter: types.VehicleFilter
  ): Promise<SelectQueryBuilder<Vehicle>> {
    if (filter.engineModel) {
      if (filter.engineModel.eq) {
        qb.andWhere('vehicle.engineModel LIKE :engineModelEq', {
          engineModelEq: filter.engineModel.eq
        })
      }
      if (filter.engineModel.contains) {
        qb.andWhere('vehicle.engineModel LIKE :engineModelContains', {
          engineModelContains: `%${filter.engineModel.contains}%`
        })
      }
    }
    if (filter.model) {
      if (filter.model.eq) {
        qb.andWhere('vehicle.model LIKE :modelEq', {
          modelEq: filter.model.eq
        })
      }
      if (filter.model.contains) {
        qb.andWhere('vehicle.model LIKE :modelContains', {
          modelContains: `%${filter.model.contains}%`
        })
      }
    }
    if (filter.releaseYear) {
      if (filter.releaseYear.eq) {
        qb.andWhere('vehicle.releaseYear LIKE :releaseYearEq', {
          releaseYearEq: filter.releaseYear.eq
        })
      }
      if (filter.releaseYear.contains) {
        qb.andWhere('vehicle.releaseYear LIKE :releaseYearContains', {
          releaseYearContains: `%${filter.releaseYear.contains}%`
        })
      }
    }
    if (filter.stateNumber) {
      if (filter.stateNumber.eq) {
        qb.andWhere('vehicle.stateNumber LIKE :stateNumberEq', {
          stateNumberEq: filter.stateNumber.eq
        })
      }
      if (filter.stateNumber.contains) {
        qb.andWhere('vehicle.stateNumber LIKE :stateNumberContains', {
          stateNumberContains: `%${filter.stateNumber.contains}%`
        })
      }
    }
    if (filter.ownerName) {
      if (filter.ownerName.eq) {
        qb.leftJoin('vehicle.owner', 'owner').andWhere(
          'owner.name LIKE :ownerNameEq',
          {
            ownerNameEq: filter.ownerName.eq
          }
        )
      }
      if (filter.ownerName.contains) {
        qb.leftJoin('vehicle.owner', 'owner').andWhere(
          'owner.name LIKE :ownerNameContains',
          {
            ownerNameContains: `%${filter.ownerName.contains}%`
          }
        )
      }
    }
    if (filter.ownerId) {
      if (filter.ownerId.eq) {
        qb.andWhere('vehicle.owner = :ownerEq', {
          ownerEq: filter.ownerId.eq
        })
      }
      if (filter.ownerId.in) {
        qb.andWhere('vehicle.owner IN :...ownerIn', {
          ownerIn: filter.ownerId.in
        })
      }
    }
    return qb
  }
}
