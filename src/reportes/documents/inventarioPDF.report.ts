import { TDocumentDefinitions } from "pdfmake/interfaces";

interface ReporteInventarioData {
    resumen: {
        totalProductos: number;
        productosBajoStock: number;
        valorTotalInventario: number;
    };
    productos: Array<{
        codigo: string;
        nombre: string;
        categoria: { nombre: string };
        stock: number;
        stockMinimo: number;
        precioCompra: number;
        precioVenta: number;
        estado: boolean;
    }>;
}

interface PDFData {
    data: ReporteInventarioData;
}

export const inventarioPDF = ({ data }: PDFData): TDocumentDefinitions => {
    const fechaActual = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const tableBody = [
        ['Código', 'Producto', 'Categoría', 'Stock', 'Stock Mín.', 'P. Compra', 'P. Venta', 'Estado']
    ];

    data.productos.forEach((producto) => {
        tableBody.push([
            producto.codigo,
            producto.nombre,
            producto.categoria.nombre,
            producto.stock.toString(),
            producto.stockMinimo.toString(),
            `S/ ${Number(producto.precioCompra).toFixed(2)}`,
            `S/ ${Number(producto.precioVenta).toFixed(2)}`,
            producto.estado ? 'Activo' : 'Inactivo'
        ]);
    });

    return {
        pageOrientation: 'landscape',
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
                text: 'Reporte de Inventario',
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
                            { text: 'Total Productos: ', bold: true },
                            { text: data.resumen.totalProductos.toString() }
                        ]
                    },
                    {
                        width: '33%',
                        text: [
                            { text: 'Productos Bajo Stock: ', bold: true },
                            { text: data.resumen.productosBajoStock.toString(), color: '#dc2626' }
                        ]
                    },
                    {
                        width: '34%',
                        text: [
                            { text: 'Valor Total: ', bold: true },
                            { text: `S/ ${data.resumen.valorTotalInventario.toFixed(2)}`, color: '#16a34a' }
                        ]
                    }
                ],
                margin: [0, 0, 0, 20]
            },
            {
                table: {
                    headerRows: 1,
                    widths: [60, '*', 80, 50, 50, 60, 60, 50],
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