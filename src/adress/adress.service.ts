import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./entities/adress.entity";
import { Repository } from "typeorm";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private repo: Repository<Address>,
  ) {}

  create(userId: number, dto: any) {
    return this.repo.save({ ...dto, userId });
  }

  findMy(userId: number) {
    return this.repo.find({ where: { userId } });
  }

  remove(id: number, userId: number) {
    return this.repo.delete({ id, userId });
  }
}
