import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { plainToClass } from 'class-transformer';


import { UserService } from '@app/user/services/user.service'

import * as dto from '../dto/vehicle.dto'
import { Vehicle } from '../entities/vehicle.entity'

@Injectable()
export class VehicleService {
  tableName = "vehicle"

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly userService: UserService
  ) {}

  async findById(id: number): Promise<Vehicle | undefined> {
    return await this.vehicleRepository.findOne(id)
  }

  async findByIdOrFail(id: number): Promise<Vehicle> {
    return await this.vehicleRepository.findOneOrFail(id)
  }

  async create(input: dto.VehicleCreateInput) {
    const record = await this.vehicleRepository.create()

    return this.update(record, input)
  }

  async update(record: Vehicle, input: dto.VehicleUpdateInput) {
    const {
      owner,
      ...data
    } = input

    for (let key of Object.keys(data)) {
      record[key] = data[key]
    }

    if (typeof owner !== 'undefined') {
      const ownerEntity = await this.userService.findByIdOrFail(owner)
      record.owner = Promise.resolve(ownerEntity)
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

  applySort(
    qb: SelectQueryBuilder<Vehicle>,
    sort: dto.VehicleSort[]
  ): SelectQueryBuilder<Vehicle> {
    for (const value of sort) {
      let arr = value.split('_') as [string, 'ASC' | 'DESC']
      qb.orderBy(`${this.tableName}.${arr[0]}`, arr[1])
    }
    return qb
  }

  applyFilter(
    qb: SelectQueryBuilder<Vehicle>,
    filter: dto.VehicleFilter
  ): SelectQueryBuilder<Vehicle> {
    let classFilter = plainToClass(dto.VehicleFilter, filter)
    classFilter.applyFilter(this.tableName, qb)
    return qb
  }
}
