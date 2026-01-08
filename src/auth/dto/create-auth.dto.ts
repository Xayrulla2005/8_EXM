import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @MinLength(6)
  email:string

  @IsString()
  @MinLength(8)
  password:string

  @IsString()
  @MinLength(6)
  username:string
}

export class LoginDto {
  @IsEmail()
  email:string

  @IsString()
  password:string
}
