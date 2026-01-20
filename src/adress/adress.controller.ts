import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";
import { AddressService } from "./adress.service";

@ApiTags('Address')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private service: AddressService) {}

  @Post()
  create(@Req() req, @Body() dto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  my(@Req() req) {
    return this.service.findMy(req.user.id);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: number) {
    return this.service.remove(+id, req.user.id);
  }
}
