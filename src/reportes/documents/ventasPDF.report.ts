import { TDocumentDefinitions } from "pdfmake/interfaces";

interface ReporteVentasData {
    resumen: {
        totalVentas: number;
        montoTotalVentas: number;
        promedioVenta: number;
        ventasPorFormaPago: Record<string, number>;
    };
    ventas: Array<{
        id: string;
        fechaVenta: Date;
        cliente: { nombre: string } | null;
        total: number;
        formaPago: string;
        detalles: Array<{
            producto: { nombre: string };
            cantidad: number;
            precioUnitario: number;
        }>;
    }>;
}

interface PDFData {
    data: ReporteVentasData;
}

export const ventasPDF = ({ data }: PDFData): TDocumentDefinitions => {
    const fechaActual = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const tableBody = [
        ['Fecha', 'Cliente', 'Forma de Pago', 'Items', 'Total']
    ];

    data.ventas.forEach((venta) => {
        const fechaVenta = new Date(venta.fechaVenta).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const clienteNombre = venta.cliente 
            ? venta.cliente.nombre
            : 'Sin Cliente';
        
        const cantidadItems = venta.detalles.reduce((sum, d) => sum + d.cantidad, 0);

        tableBody.push([
            fechaVenta,
            clienteNombre,
            venta.formaPago,
            cantidadItems.toString(),
            `S/ ${Number(venta.total).toFixed(2)}`
        ]);
    });

    // Crear resumen de formas de pago
    const formasPagoText = Object.entries(data.resumen.ventasPorFormaPago)
        .map(([forma, cantidad]) => `${forma}: ${cantidad}`)
        .join(' | ');

    return {
        pageOrientation: 'portrait',
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: {
            text: 'Sistema Librería',
            alignment: 'right',
            margin: [40, 20, 40, 0],
            fontSize: 10,
            color: '#666666'
        },
        content: [
            {
                text: 'Reporte de Ventas',
                style: 'header',
                alignment: 'center',
                bold: true,
                fontSize: 20,
                margin: [0, 0, 0, 10]
            },
            {
                text: `Fecha: ${fechaActual}`,
                alignment: 'center',
                fontSize: 10,
                color: '#666666',
                margin: [0, 0, 0, 20]
            },
            {
                columns: [
                    {
                        width: '33%',
                        text: [
                            { text: 'Total Ventas: ', bold: true },
                            { text: data.resumen.totalVentas.toString() }
                        ]
                    },
                    {
                        width: '33%',
                        text: [
                            { text: 'Promedio: ', bold: true },
                            { text: `S/ ${data.resumen.promedioVenta.toFixed(2)}`, color: '#0ea5e9' }
                        ]
                    },
                    {
                        width: '34%',
                        text: [
                            { text: 'Monto Total: ', bold: true },
                            { text: `S/ ${data.resumen.montoTotalVentas.toFixed(2)}`, color: '#16a34a' }
                        ]
                    }
                ],
                margin: [0, 0, 0, 10]
            },
            {
                text: [
                    { text: 'Ventas por Forma de Pago: ', bold: true, fontSize: 10 },
                    { text: formasPagoText, fontSize: 9 }
                ],
                margin: [0, 0, 0, 20]
            },
            {
                table: {
                    headerRows: 1,
                    widths: [100, '*', 80, 50, 70],
                    body: tableBody
                },
                layout: {
                    fillColor: (rowIndex) => {
                        return rowIndex === 0 ? '#f3f4f6' : null;
                    },
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#e5e7eb',
                    vLineColor: () => '#e5e7eb',
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            }
        },
        defaultStyle: {
            fontSize: 9
        }
    };
};
