import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterService } from '../printer/printer.service';
import { Venta } from './entities/venta.entity';

@Injectable()
export class TicketService {
  constructor(private readonly printerService: PrinterService) {}

  async generateTicket(venta: Venta): Promise<PDFKit.PDFDocument> {
    const docDefinition = this.getTicketDefinition(venta);
    return this.printerService.createPdf(docDefinition);
  }

  private getTicketDefinition(venta: Venta): TDocumentDefinitions {
    const IGV_RATE = 0.18;
    const subtotal = Number(venta.total) / (1 + IGV_RATE);
    const igv = Number(venta.total) - subtotal;

    return {
      pageSize: {
        width: 226.77, // 80mm en puntos
        height: 'auto',
      },
      pageMargins: [10, 10, 10, 10],
      content: [
        // Encabezado
        {
          text: 'LIBRERÍA SISTEMA',
          style: 'header',
          alignment: 'center',
        },
        {
          text: 'RUC: 20123456789',
          style: 'subheader',
          alignment: 'center',
        },
        {
          text: 'Jr. Ejemplo 123 - Lima',
          style: 'subheader',
          alignment: 'center',
        },
        {
          text: 'Tel: (01) 123-4567',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 206.77,
              y2: 0,
              lineWidth: 1,
              dash: { length: 2 },
            },
          ],
          margin: [0, 5, 0, 5] as [number, number, number, number],
        },
        // Datos de la venta
        {
          text: 'NOTA DE VENTA',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          text: `Nro: ${venta.id.substring(0, 8).toUpperCase()}`,
          style: 'info',
          alignment: 'center',
        },
        {
          text: `Fecha: ${new Date(venta.fechaVenta).toLocaleString('es-PE', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}`,
          style: 'info',
          alignment: 'center',
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 206.77,
              y2: 0,
              lineWidth: 1,
              dash: { length: 2 },
            },
          ],
          margin: [0, 5, 0, 5] as [number, number, number, number],
        },
        // Datos del cliente (si existe)
        ...(venta.cliente
          ? [
              {
                text: `Cliente: ${venta.cliente.nombre}`,
                style: 'info',
              },
              {
                text: `${venta.cliente.dni ? `DNI: ${venta.cliente.dni}` : ''}`,
                style: 'info',
                margin: [0, 0, 0, 5] as [number, number, number, number],
              },
            ]
          : [
              {
                text: 'Cliente: Público General',
                style: 'info',
                margin: [0, 0, 0, 5] as [number, number, number, number],
              },
            ]),
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 206.77,
              y2: 0,
              lineWidth: 1,
              dash: { length: 2 },
            },
          ],
          margin: [0, 5, 0, 5] as [number, number, number, number],
        },
        // Encabezado de productos
        {
          columns: [
            { text: 'CANT', width: 30, style: 'tableHeader' },
            { text: 'DESCRIPCIÓN', width: '*', style: 'tableHeader' },
            { text: 'P.U.', width: 40, style: 'tableHeader', alignment: 'right' },
            { text: 'TOTAL', width: 45, style: 'tableHeader', alignment: 'right' },
          ],
          margin: [0, 0, 0, 3] as [number, number, number, number],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 206.77,
              y2: 0,
              lineWidth: 1,
            },
          ],
          margin: [0, 0, 0, 3] as [number, number, number, number],
        },
        // Productos
        ...venta.detalles.map((detalle) => ({
          columns: [
            { text: detalle.cantidad.toString(), width: 30, style: 'item' },
            { text: detalle.producto.nombre, width: '*', style: 'item' },
            {
              text: Number(detalle.precioUnitario).toFixed(2),
              width: 40,
              style: 'item',
              alignment: 'right' as const,
            },
            {
              text: (detalle.cantidad * Number(detalle.precioUnitario)).toFixed(2),
              width: 45,
              style: 'item',
              alignment: 'right' as const,
            },
          ],
          margin: [0, 0, 0, 2] as [number, number, number, number],
        })),
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 206.77,
              y2: 0,
              lineWidth: 1,
            },
          ],
          margin: [0, 5, 0, 5] as [number, number, number, number],
        },
        // Totales
        {
          columns: [
            { text: '', width: '*' },
            { text: 'SUBTOTAL:', width: 80, style: 'total', alignment: 'right' },
            { text: `S/ ${subtotal.toFixed(2)}`, width: 45, style: 'total', alignment: 'right' },
          ],
          margin: [0, 0, 0, 2] as [number, number, number, number],
        },
        {
          columns: [
            { text: '', width: '*' },
            { text: 'IGV (18%):', width: 80, style: 'total', alignment: 'right' },
            { text: `S/ ${igv.toFixed(2)}`, width: 45, style: 'total', alignment: 'right' },
          ],
          margin: [0, 0, 0, 2] as [number, number, number, number],
        },
        {
          columns: [
            { text: '', width: '*' },
            { text: 'TOTAL:', width: 80, style: 'totalBold', alignment: 'right' },
            {
              text: `S/ ${Number(venta.total).toFixed(2)}`,
              width: 45,
              style: 'totalBold',
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 206.77,
              y2: 0,
              lineWidth: 1,
              dash: { length: 2 },
            },
          ],
          margin: [0, 5, 0, 5] as [number, number, number, number],
        },
        // Forma de pago
        {
          text: `Forma de Pago: ${venta.formaPago}`,
          style: 'info',
          alignment: 'center',
          margin: [0, 0, 0, 10] as [number, number, number, number],
        },
        // Pie de página
        {
          text: '¡Gracias por su compra!',
          style: 'footer',
          alignment: 'center',
          margin: [0, 5, 0, 0] as [number, number, number, number],
        },
        {
          text: 'www.libreriasistema.com',
          style: 'footer',
          alignment: 'center',
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
        },
        subheader: {
          fontSize: 8,
        },
        info: {
          fontSize: 8,
        },
        tableHeader: {
          fontSize: 8,
          bold: true,
        },
        item: {
          fontSize: 8,
        },
        total: {
          fontSize: 9,
        },
        totalBold: {
          fontSize: 10,
          bold: true,
        },
        footer: {
          fontSize: 8,
          italics: true,
        },
      },
      defaultStyle: {
        font: 'Roboto',
      },
    };
  }
}
