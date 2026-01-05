import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { ReportesService } from './reportes.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Reportes')
@ApiBearerAuth()
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('inventario')
  @Auth()
  @ApiOperation({ summary: 'Obtener reporte de inventario' })
  @ApiQuery({ name: 'categoriaId', required: false, type: String })
  @ApiQuery({ name: 'stockBajo', required: false, type: Boolean })
  async getReporteInventario(
    @Query('categoriaId') categoriaId?: string,
    @Query('stockBajo') stockBajo?: boolean,
  ) {
    return this.reportesService.getReporteInventario(categoriaId, stockBajo);
  }

  @Get('ventas')
  @Auth()
  @ApiOperation({ summary: 'Obtener reporte de ventas' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'clienteId', required: false, type: String })
  async getReporteVentas(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('clienteId') clienteId?: string,
  ) {
    return this.reportesService.getReporteVentas(startDate, endDate, clienteId);
  }

  @Get('compras')
  @Auth()
  @ApiOperation({ summary: 'Obtener reporte de compras' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'proveedorId', required: false, type: String })
  async getReporteCompras(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('proveedorId') proveedorId?: string,
  ) {
    return this.reportesService.getReporteCompras(startDate, endDate, proveedorId);
  }

  //PDF Reports
  @Get('inventario/pdf')
  // @Auth()
  @ApiOperation({ summary: 'Obtener reporte de inventario en PDF' })
  @ApiQuery({ name: 'categoriaId', required: false, type: String })
  @ApiQuery({ name: 'stockBajo', required: false, type: Boolean })
  async getReporteInventarioPDF(
    @Res() response: Response,
    @Query('categoriaId') categoriaId?: string,
    @Query('stockBajo') stockBajo?: boolean,
  ) {
    response.setHeader('Content-Type', 'application/pdf');
    const pdfDoc = await this.reportesService.getReporteInventarioPDF(categoriaId, stockBajo);

    pdfDoc.info.Title = 'Reporte de Inventario';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
