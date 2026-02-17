import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { VentasService } from './ventas.service';
import { TicketService } from './ticket.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { FindVentasDto } from './dto/find-ventas.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Permission } from '../auth/enums/permissions.enum';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('ventas')
@Controller('ventas')
export class VentasController {
  constructor(
    private readonly ventasService: VentasService,
    private readonly ticketService: TicketService,
  ) {}

  @Post()
  @Auth({ permissions: [Permission.CREATE_VENTA] })
  @ApiResponse({ status: 201, description: 'Venta registrada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o stock insuficiente.' })
  @ApiResponse({ status: 404, description: 'Cliente o producto no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  create(
    @Body() createVentaDto: CreateVentaDto,
    @GetUser() user: User
  ) {
    return this.ventasService.create(createVentaDto, user);
  }

  @Get()
  @Auth({ permissions: [Permission.READ_VENTA] })
  @ApiResponse({ status: 200, description: 'Lista de ventas obtenida correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  findAll(@Query() findVentasDto: FindVentasDto) {
    return this.ventasService.findAll(findVentasDto);
  }

  @Get(':id')
  @Auth({ permissions: [Permission.READ_VENTA] })
  @ApiResponse({ status: 200, description: 'Venta obtenida correctamente.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ventasService.findOne(id);
  }

  @Get(':id/ticket')
  @Auth({ permissions: [Permission.READ_VENTA] })
  @ApiResponse({ status: 200, description: 'Ticket generado correctamente.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  async getTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const venta = await this.ventasService.findOne(id);
    const pdfDoc = await this.ticketService.generateTicket(venta);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="ticket-${venta.id}.pdf"`,
    );

    pdfDoc.info.Title = `Ticket de Venta ${venta.id}`;
    pdfDoc.pipe(res);
    pdfDoc.end();
  }

  @Delete(':id')
  @Auth({ permissions: [Permission.DELETE_VENTA] })
  @ApiResponse({ status: 200, description: 'Venta eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.ventasService.remove(id, user);
  }
}
