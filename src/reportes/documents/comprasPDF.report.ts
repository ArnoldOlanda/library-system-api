import { TDocumentDefinitions } from "pdfmake/interfaces";

interface ReporteComprasData {
    resumen: {
        totalCompras: number;
        montoTotalCompras: number;
        promedioCompra: number;
    };
    compras: Array<{
        id: string;
        fechaCompra: Date;
        proveedor: { nombre: string };
        total: number;
        detalles: Array<{
            producto: { nombre: string };
            cantidad: number;
            precioUnitario: number;
        }>;
    }>;
}

interface PDFData {
    data: ReporteComprasData;
}

export const comprasPDF = ({ data }: PDFData): TDocumentDefinitions => {
    const fechaActual = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const tableBody = [
        ['Fecha', 'Proveedor', 'Items', 'Total']
    ];

    data.compras.forEach((compra) => {
        const fechaCompra = new Date(compra.fechaCompra).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const cantidadItems = compra.detalles.reduce((sum, d) => sum + d.cantidad, 0);

        tableBody.push([
            fechaCompra,
            compra.proveedor.nombre,
            cantidadItems.toString(),
            `S/ ${Number(compra.total).toFixed(2)}`
        ]);
    });

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
                text: 'Reporte de Compras',
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
                            { text: 'Total Compras: ', bold: true },
                            { text: data.resumen.totalCompras.toString() }
                        ]
                    },
                    {
                        width: '33%',
                        text: [
                            { text: 'Promedio: ', bold: true },
                            { text: `S/ ${data.resumen.promedioCompra.toFixed(2)}`, color: '#0ea5e9' }
                        ]
                    },
                    {
                        width: '34%',
                        text: [
                            { text: 'Monto Total: ', bold: true },
                            { text: `S/ ${data.resumen.montoTotalCompras.toFixed(2)}`, color: '#16a34a' }
                        ]
                    }
                ],
                margin: [0, 0, 0, 20]
            },
            {
                table: {
                    headerRows: 1,
                    widths: [100, '*', 60, 80],
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
