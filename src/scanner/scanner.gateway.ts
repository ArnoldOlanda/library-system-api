import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ProductosService } from '../productos/productos.service';

interface ScanBarcodePayload {
  barcode: string;
  sessionId?: string;
}

interface ConnectedClient {
  id: string;
  sessionId?: string;
  type: 'scanner' | 'pos';
}

@WebSocketGateway({
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || false
      : true, // Permitir todos los orígenes en desarrollo (móviles, IPs locales)
    credentials: true,
  },
  namespace: '/scanner',
  transports: ['polling', 'websocket'], // Polling primero para móviles
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class ScannerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ScannerGateway.name);
  private connectedClients: Map<string, ConnectedClient> = new Map();

  constructor(private readonly productosService: ProductosService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { type: 'scanner' | 'pos'; sessionId?: string },
  ) {
    this.connectedClients.set(client.id, {
      id: client.id,
      sessionId: payload.sessionId,
      type: payload.type,
    });

    this.logger.log(
      `Client ${client.id} registered as ${payload.type} with session ${payload.sessionId || 'none'}`,
    );

    return {
      success: true,
      message: `Registered as ${payload.type}`,
      clientId: client.id,
    };
  }

  @SubscribeMessage('scanBarcode')
  async handleScanBarcode(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ScanBarcodePayload,
  ) {
    this.logger.log(`Barcode scanned: ${payload.barcode} with session ${payload.sessionId}`);

    try {
      // Buscar producto por código de barras
      const producto = await this.productosService.findByBarcode(
        payload.barcode,
      );

      // Usar sessionId del payload (siempre se envía)
      const sessionId = payload.sessionId;
      
      // Filtrar solo clientes POS con la misma sesión
      const targetClients = Array.from(this.connectedClients.values()).filter(
        (c) => c.type === 'pos' && c.sessionId === sessionId,
      );

      if (!producto) {
        // Producto no encontrado - emitir evento newProductScanned a todos los POS con la misma sesión
        targetClients.forEach((targetClient) => {
          this.server.to(targetClient.id).emit('newProductScanned', {
            barcode: payload.barcode,
            scannedBy: client.id,
            timestamp: new Date().toISOString(),
          });
        });

        this.logger.log(
          `New product barcode ${payload.barcode} sent to ${targetClients.length} POS client(s)`,
        );

        return {
          success: true,
          message: 'Nuevo producto escaneado',
          barcode: payload.barcode,
          sentToClients: targetClients.length,
        };
      }

      // Producto encontrado - emitir evento productScanned a todos los POS con la misma sesión
      targetClients.forEach((targetClient) => {
        this.server.to(targetClient.id).emit('productScanned', {
          producto,
          scannedBy: client.id,
          timestamp: new Date().toISOString(),
        });
      });

      // Confirmar al escáner
      client.emit('scanSuccess', {
        producto,
        sentToClients: targetClients.length,
      });

      this.logger.log(
        `Product ${producto.nombre} sent to ${targetClients.length} POS client(s)`,
      );

      return {
        success: true,
        producto,
        sentToClients: targetClients.length,
      };
    } catch (error) {
      this.logger.error(`Error processing barcode scan: ${error.message}`);
      
      client.emit('scanError', {
        message: 'Error al procesar el código de barras',
        error: error.message,
      });

      return {
        success: false,
        message: 'Error al procesar el código de barras',
        error: error.message,
      };
    }
  }

  @SubscribeMessage('getConnectedClients')
  handleGetConnectedClients(@ConnectedSocket() client: Socket) {
    const clients = Array.from(this.connectedClients.values());
    return {
      total: clients.length,
      scanners: clients.filter((c) => c.type === 'scanner').length,
      pos: clients.filter((c) => c.type === 'pos').length,
      clients: clients.map((c) => ({
        id: c.id,
        type: c.type,
        sessionId: c.sessionId,
      })),
    };
  }
}
