import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Venta } from '../ventas/entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { DetalleVenta } from '../ventas/entities/detalle-venta.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalProducts,
      totalClients,
      salesToday,
      revenueMonth,
    ] = await Promise.all([
      this.productoRepository.count(),
      this.clienteRepository.count(),
      this.ventaRepository.count({
        where: { fechaVenta: Between(today, endOfToday) },
      }),
      this.ventaRepository
        .createQueryBuilder('venta')
        .select('SUM(venta.total)', 'total')
        .where('venta.fechaVenta BETWEEN :start AND :end', {
          start: firstDayOfMonth,
          end: endOfToday,
        })
        .getRawOne(),
    ]);

    return {
      totalProducts,
      totalClients,
      salesToday,
      revenueMonth: parseFloat(revenueMonth.total || 0),
    };
  }

  async getSalesChartData() {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    // Agrupar ventas por día de los últimos 30 días
    const sales = await this.ventaRepository
      .createQueryBuilder('venta')
      .select("DATE_TRUNC('day', venta.fechaVenta)", 'date')
      .addSelect('SUM(venta.total)', 'total')
      .where('venta.fechaVenta >= :date', { date: last30Days })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    return sales.map(s => ({
      date: s.date.toISOString().split('T')[0],
      total: parseFloat(s.total),
    }));
  }

  async getTopProducts() {
    return await this.detalleVentaRepository
      .createQueryBuilder('detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .select('producto.nombre', 'nombre')
      .addSelect('SUM(detalle.cantidad)', 'totalvendido')
      .groupBy('producto.id')
      .addGroupBy('producto.nombre')
      .orderBy('totalvendido', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async getRecentSales() {
    return await this.ventaRepository.find({
      relations: ['cliente'],
      order: { fechaVenta: 'DESC' },
      take: 5,
    });
  }
}
