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
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/scanner',
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
    this.logger.log(`Barcode scanned: ${payload.barcode} from client ${client.id}`);

    try {
      // Buscar producto por código de barras
      const producto = await this.productosService.findByBarcode(
        payload.barcode,
      );

      if (!producto) {
        // Emitir evento de error al cliente que escaneó
        client.emit('scanError', {
          message: 'Producto no encontrado',
          barcode: payload.barcode,
        });

        return {
          success: false,
          message: 'Producto no encontrado',
        };
      }

      // Emitir el producto encontrado a todos los clientes POS con la misma sesión
      // o a todos los POS si no hay sesión especificada
      const clientInfo = this.connectedClients.get(client.id);
      const targetClients = Array.from(this.connectedClients.values()).filter(
        (c) => {
          if (c.type !== 'pos') return false;
          
          // Si el escáner tiene sessionId, solo enviar a POS con el mismo sessionId
          if (clientInfo?.sessionId) {
            return c.sessionId === clientInfo.sessionId;
          }
          
          // Si no hay sessionId, enviar a todos los POS
          return true;
        },
      );

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
