import { Brand } from "@app/brand/entities/brand.entity"
import { Lubricant } from "@app/lubricant/entities/lubricant.entity"
import { Controller, Get } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Controller('migrate')
export class MigrateController {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Lubricant)
    private readonly lubricantRepository: Repository<Lubricant>,
  ) {}

  // @Get('brand-migrate')
  // async brandMigrate() {
  //   const lubricants = await this.lubricantRepository.find()

  //   let addedBrands = 0
  //   let changedLubricants = 0

  //   for (const lubricant of lubricants) {
  //     let brand = await this.brandRepository.findOneBy({ name: lubricant.brand })
  //     if (!brand) {
  //       brand = new Brand()
  //       brand.name = lubricant.brand
  //       await this.brandRepository.save(brand)
  //       addedBrands++
  //     }
  //     const brandEntity = await lubricant.brandEntity
  //     if (!brandEntity || brandEntity.id !== brand.id) {
  //       lubricant.brandEntity = Promise.resolve(brand)
  //       await this.lubricantRepository.save(lubricant)
  //       changedLubricants++
  //     }
  //   }

  //   return `addedBrands: ${addedBrands}<br />changedLubricants: ${changedLubricants}`
  // }
}
