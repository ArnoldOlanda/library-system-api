import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../productos/entities/producto.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { Compra } from '../compras/entities/compra.entity';
import { PrinterService } from 'src/printer/printer.service';
import { inventarioPDF } from './documents/inventarioPDF.report';
import { ventasPDF } from './documents/ventasPDF.report';
import { comprasPDF } from './documents/comprasPDF.report';

@Injectable()
export class ReportesService {
  private readonly logger = new Logger(ReportesService.name);

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    private readonly printerService: PrinterService,
  ) {}

  async getReporteInventario(categoriaId?: string, stockBajo?: boolean) {
    const query = this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .select([
        'producto.id',
        'producto.codigo',
        'producto.nombre',
        'producto.stock',
        'producto.stockMinimo',
        'producto.precioCompra',
        'producto.precioVenta',
        'producto.estado',
        'categoria.id',
        'categoria.nombre',
      ])
      .where('producto.estado = :estado', { estado: true });

    if (categoriaId) {
      query.andWhere('categoria.id = :categoriaId', { categoriaId });
    }

    if (stockBajo) {
      query.andWhere('producto.stock <= producto.stockMinimo');
    }

    const productos = await query.getMany();

    const totalProductos = productos.length;
    const productosBajoStock = productos.filter(p => p.stock <= p.stockMinimo).length;
    const valorTotalInventario = productos.reduce(
      (sum, p) => sum + (p.stock * Number(p.precioCompra)),
      0,
    );

    return {
      resumen: {
        totalProductos,
        productosBajoStock,
        valorTotalInventario: Number(valorTotalInventario.toFixed(2)),
      },
      productos,
    };
  }

  async getReporteVentas(startDate?: string, endDate?: string, clienteId?: string) {
    const query = this.ventaRepository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('venta.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto')
      .orderBy('venta.fechaVenta', 'DESC');

    if (startDate && endDate) {
      query.andWhere('venta.fechaVenta BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    if (clienteId) {
      query.andWhere('cliente.id = :clienteId', { clienteId });
    }

    const ventas = await query.getMany();

    const totalVentas = ventas.length;
    const montoTotalVentas = ventas.reduce((sum, v) => sum + Number(v.total), 0);
    const promedioVenta = totalVentas > 0 ? montoTotalVentas / totalVentas : 0;
    const ventasPorFormaPago = ventas.reduce((acc, v) => {
      acc[v.formaPago] = (acc[v.formaPago] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      resumen: {
        totalVentas,
        montoTotalVentas: Number(montoTotalVentas.toFixed(2)),
        promedioVenta: Number(promedioVenta.toFixed(2)),
        ventasPorFormaPago,
      },
      ventas,
    };
  }

  async getReporteCompras(startDate?: string, endDate?: string, proveedorId?: string) {
    const query = this.compraRepository
      .createQueryBuilder('compra')
      .leftJoinAndSelect('compra.proveedor', 'proveedor')
      .leftJoinAndSelect('compra.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto')
      .orderBy('compra.fechaCompra', 'DESC');

    if (startDate && endDate) {
      query.andWhere('compra.fechaCompra BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    if (proveedorId) {
      query.andWhere('proveedor.id = :proveedorId', { proveedorId });
    }

    const compras = await query.getMany();

    const totalCompras = compras.length;
    const montoTotalCompras = compras.reduce((sum, c) => sum + Number(c.total), 0);
    const promedioCompra = totalCompras > 0 ? montoTotalCompras / totalCompras : 0;

    return {
      resumen: {
        totalCompras,
        montoTotalCompras: Number(montoTotalCompras.toFixed(2)),
        promedioCompra: Number(promedioCompra.toFixed(2)),
      },
      compras,
    };
  }

  async getReporteInventarioPDF(categoriaId?: string, stockBajo?: boolean) {
    const data = await this.getReporteInventario(categoriaId, stockBajo);

    const pdfDefinitions = inventarioPDF({data});

    return this.printerService.createPdf(pdfDefinitions);
  }

  async getReporteVentasPDF(startDate?:string, endDate?:string, clienteId?: string){
    const data = await this.getReporteVentas(startDate, endDate, clienteId);

    const pdfDefinitions = ventasPDF({data});

    return this.printerService.createPdf(pdfDefinitions);
  }

  async getReporteComprasPDF(startDate?:string, endDate?:string, proveedorId?: string){
    const data = await this.getReporteCompras(startDate, endDate, proveedorId);

    const pdfDefinitions = comprasPDF({data});

    return this.printerService.createPdf(pdfDefinitions);
  }
}
