import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArqueosCajaService } from './arqueos-caja.service';
import { CreateArqueoCajaDto } from './dto/create-arqueo-caja.dto';
import { UpdateArqueoCajaDto } from './dto/update-arqueo-caja.dto';
import { PaginationDto } from '../users/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Permission } from '../auth/enums/permissions.enum';

@ApiBearerAuth()
@ApiTags('arqueos-caja')
@Controller('arqueos-caja')
export class ArqueosCajaController {
  constructor(private readonly arqueosCajaService: ArqueosCajaService) {}

  @Post()
  @Auth({ permissions: [Permission.CREATE_ARQUEO] })
  @ApiResponse({ status: 201, description: 'Arqueo de caja creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  create(@Body() createArqueoCajaDto: CreateArqueoCajaDto) {
    return this.arqueosCajaService.create(createArqueoCajaDto);
  }

  @Get()
  @Auth({ permissions: [Permission.READ_ARQUEO] })
  @ApiResponse({ status: 200, description: 'Lista de arqueos obtenida correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.arqueosCajaService.findAll(paginationDto);
  }

  @Get('open/today')
  @Auth({ permissions: [Permission.READ_ARQUEO] })
  @ApiResponse({ status: 200, description: 'Caja abierta obtenida correctamente.' })
  @ApiResponse({ status: 404, description: 'No hay caja abierta para el día de hoy.' })
  findOpenCaja() {
    return this.arqueosCajaService.findOpenCaja();
  }

  @Get(':id')
  @Auth({ permissions: [Permission.READ_ARQUEO] })
  @ApiResponse({ status: 200, description: 'Arqueo de caja obtenido correctamente.' })
  @ApiResponse({ status: 404, description: 'Arqueo de caja no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.arqueosCajaService.findOne(id);
  }


  @Patch(':id')
  @Auth({ permissions: [Permission.UPDATE_ARQUEO] })
  @ApiResponse({ status: 200, description: 'Arqueo de caja actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Arqueo de caja no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArqueoCajaDto: UpdateArqueoCajaDto,
  ) {
    return this.arqueosCajaService.update(id, updateArqueoCajaDto);
  }

  @Delete(':id')
  @Auth({ permissions: [Permission.DELETE_ARQUEO] })
  @ApiResponse({ status: 200, description: 'Arqueo de caja eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Arqueo de caja no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.arqueosCajaService.remove(id);
  }

}
