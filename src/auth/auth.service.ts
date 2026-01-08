import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/auth.entity'; 
import { JwtService } from '@nestjs/jwt';
import { UpdateAuthDto } from './dto/update-auth.dto';
import bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepo:Repository<User>,
  private readonly jwtService:JwtService){}
 
 
 async register(registerDto: RegisterDto) {
    const user=await this.userRepo.findOne({where:{email:registerDto.email}})
    if(!user) throw new BadRequestException("Email alredy exsist")

     const hash = await bcrypt.hash(registerDto.password, 10);
  return   
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
