import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1769260673121 implements MigrationInterface {
    name = 'InitDb1769260673121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clientes" ("id" uuid NOT NULL, "nombre" character varying(200) NOT NULL, "dni" character varying(20), "telefono" character varying(20), "correo" character varying(100), "direccion" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."ventas_formapago_enum" AS ENUM('Efectivo', 'Tarjeta', 'Transferencia', 'Yape', 'Plin')`);
        await queryRunner.query(`CREATE TABLE "ventas" ("id" uuid NOT NULL, "fechaVenta" TIMESTAMP NOT NULL, "total" numeric(10,2) NOT NULL, "formaPago" "public"."ventas_formapago_enum" NOT NULL DEFAULT 'Efectivo', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cliente_id" uuid, CONSTRAINT "PK_b8b73abe8561829c019531d9a2e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categorias" ("id" uuid NOT NULL, "nombre" character varying(100) NOT NULL, "descripcion" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ccdf6cd1a34ea90a7233325063d" UNIQUE ("nombre"), CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proveedores" ("id" uuid NOT NULL, "nombre" character varying(200) NOT NULL, "contacto" character varying(100), "telefono" character varying(20), "correo" character varying(100), "direccion" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1dcf121f19f362fb1b4c0a493a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "compras" ("id" uuid NOT NULL, "fechaCompra" TIMESTAMP NOT NULL, "total" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "proveedor_id" uuid NOT NULL, CONSTRAINT "PK_63037d5249eefe140e3587ff6f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "detalle_compras" ("id" uuid NOT NULL, "cantidad" integer NOT NULL, "precioUnitario" numeric(10,2) NOT NULL, "compra_id" uuid NOT NULL, "producto_id" uuid NOT NULL, CONSTRAINT "PK_72aa0fd4a67a53cb705c698acad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "productos" ("id" uuid NOT NULL, "codigo" character varying(50) NOT NULL, "codigoBarras" character varying(100), "nombre" character varying(200) NOT NULL, "precioCompra" numeric(10,2) NOT NULL, "precioVenta" numeric(10,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "stockMinimo" integer NOT NULL DEFAULT '0', "descripcion" text, "estado" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoria_id" uuid NOT NULL, CONSTRAINT "UQ_2da210b34325c2319d784a32d49" UNIQUE ("codigo"), CONSTRAINT "UQ_445b15144371e2a6143d31b8e4f" UNIQUE ("codigoBarras"), CONSTRAINT "PK_04f604609a0949a7f3b43400766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "detalle_ventas" ("id" uuid NOT NULL, "cantidad" integer NOT NULL, "precioUnitario" numeric(10,2) NOT NULL, "venta_id" uuid NOT NULL, "producto_id" uuid NOT NULL, CONSTRAINT "PK_3f017a7ffaa120b5fad5990521d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_verifications" ("id" uuid NOT NULL, "tokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_c1ea2921e767f83cd44c0af203f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying, "otherField" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "avatar" character varying, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "isSocialLogin" boolean NOT NULL DEFAULT false, "socialProvider" character varying, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."movimientos_almacen_tipomovimiento_enum" AS ENUM('Entrada', 'Salida', 'Ajuste Entrada', 'Ajuste Salida')`);
        await queryRunner.query(`CREATE TYPE "public"."movimientos_almacen_origenmovimiento_enum" AS ENUM('Compra', 'Venta', 'Ajuste Manual', 'Devolución Compra', 'Devolución Venta')`);
        await queryRunner.query(`CREATE TABLE "movimientos_almacen" ("id" uuid NOT NULL, "tipoMovimiento" "public"."movimientos_almacen_tipomovimiento_enum" NOT NULL, "origenMovimiento" "public"."movimientos_almacen_origenmovimiento_enum" NOT NULL, "cantidad" integer NOT NULL, "stockAnterior" integer NOT NULL, "stockNuevo" integer NOT NULL, "referenciaId" uuid, "observaciones" text, "fechaMovimiento" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "producto_id" uuid NOT NULL, "usuario_id" uuid NOT NULL, CONSTRAINT "PK_97614e557d7e0c298501c7809ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password_reset_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d16bebd73e844c48bca50ff8d3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "arqueos_caja" ("id" uuid NOT NULL, "fechaArqueo" date NOT NULL, "montoInicial" numeric(10,2) NOT NULL, "totalRecaudado" numeric(10,2) NOT NULL, "totalEfectivo" numeric(10,2) NOT NULL, "totalTarjeta" numeric(10,2) NOT NULL, "diferencia" numeric(10,2) NOT NULL, "open" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_92034958cc18fdbc842a42f470a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions_permission" ("roleId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_b817d7eca3b85f22130861259dd" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b36cb2e04bc353ca4ede00d87b" ON "role_permissions_permission" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bfbc9e263d4cea6d7a8c9eb3ad" ON "role_permissions_permission" ("permissionId") `);
        await queryRunner.query(`CREATE TABLE "users_roles_role" ("usersId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_3fb5295f0482f3c5090b41a5427" PRIMARY KEY ("usersId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3ea8bcae76ff0b74bcc1340af8" ON "users_roles_role" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03c652226fd376f26b31503d40" ON "users_roles_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "ventas" ADD CONSTRAINT "FK_6a9b8170c731e6ca2449ea27c52" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "compras" ADD CONSTRAINT "FK_d7b3950fea313d15e46e0c59286" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_compras" ADD CONSTRAINT "FK_3fc9670dcddd10affeb865a18ed" FOREIGN KEY ("compra_id") REFERENCES "compras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_compras" ADD CONSTRAINT "FK_ab97fc85e622965fef77ba3a617" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos" ADD CONSTRAINT "FK_5aaee6054b643e7c778477193a3" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_ventas" ADD CONSTRAINT "FK_ebfe4ddaa56d1a98410cb4b7f67" FOREIGN KEY ("venta_id") REFERENCES "ventas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_ventas" ADD CONSTRAINT "FK_41f061fb15d8454df77e5806478" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ADD CONSTRAINT "FK_4e63a91e0a684b31496bd50733e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos_almacen" ADD CONSTRAINT "FK_ae8cc8100db1530b0ec2e1cdb1a" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos_almacen" ADD CONSTRAINT "FK_25ad556419f79d8b07b8621fe87" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "FK_52ac39dd8a28730c63aeb428c9c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles_role" ADD CONSTRAINT "FK_3ea8bcae76ff0b74bcc1340af86" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles_role" ADD CONSTRAINT "FK_03c652226fd376f26b31503d40c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles_role" DROP CONSTRAINT "FK_03c652226fd376f26b31503d40c"`);
        await queryRunner.query(`ALTER TABLE "users_roles_role" DROP CONSTRAINT "FK_3ea8bcae76ff0b74bcc1340af86"`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2"`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9"`);
        await queryRunner.query(`ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "FK_52ac39dd8a28730c63aeb428c9c"`);
        await queryRunner.query(`ALTER TABLE "movimientos_almacen" DROP CONSTRAINT "FK_25ad556419f79d8b07b8621fe87"`);
        await queryRunner.query(`ALTER TABLE "movimientos_almacen" DROP CONSTRAINT "FK_ae8cc8100db1530b0ec2e1cdb1a"`);
        await queryRunner.query(`ALTER TABLE "email_verifications" DROP CONSTRAINT "FK_4e63a91e0a684b31496bd50733e"`);
        await queryRunner.query(`ALTER TABLE "detalle_ventas" DROP CONSTRAINT "FK_41f061fb15d8454df77e5806478"`);
        await queryRunner.query(`ALTER TABLE "detalle_ventas" DROP CONSTRAINT "FK_ebfe4ddaa56d1a98410cb4b7f67"`);
        await queryRunner.query(`ALTER TABLE "productos" DROP CONSTRAINT "FK_5aaee6054b643e7c778477193a3"`);
        await queryRunner.query(`ALTER TABLE "detalle_compras" DROP CONSTRAINT "FK_ab97fc85e622965fef77ba3a617"`);
        await queryRunner.query(`ALTER TABLE "detalle_compras" DROP CONSTRAINT "FK_3fc9670dcddd10affeb865a18ed"`);
        await queryRunner.query(`ALTER TABLE "compras" DROP CONSTRAINT "FK_d7b3950fea313d15e46e0c59286"`);
        await queryRunner.query(`ALTER TABLE "ventas" DROP CONSTRAINT "FK_6a9b8170c731e6ca2449ea27c52"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03c652226fd376f26b31503d40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ea8bcae76ff0b74bcc1340af8"`);
        await queryRunner.query(`DROP TABLE "users_roles_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bfbc9e263d4cea6d7a8c9eb3ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b36cb2e04bc353ca4ede00d87b"`);
        await queryRunner.query(`DROP TABLE "role_permissions_permission"`);
        await queryRunner.query(`DROP TABLE "arqueos_caja"`);
        await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
        await queryRunner.query(`DROP TABLE "movimientos_almacen"`);
        await queryRunner.query(`DROP TYPE "public"."movimientos_almacen_origenmovimiento_enum"`);
        await queryRunner.query(`DROP TYPE "public"."movimientos_almacen_tipomovimiento_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "email_verifications"`);
        await queryRunner.query(`DROP TABLE "detalle_ventas"`);
        await queryRunner.query(`DROP TABLE "productos"`);
        await queryRunner.query(`DROP TABLE "detalle_compras"`);
        await queryRunner.query(`DROP TABLE "compras"`);
        await queryRunner.query(`DROP TABLE "proveedores"`);
        await queryRunner.query(`DROP TABLE "categorias"`);
        await queryRunner.query(`DROP TABLE "ventas"`);
        await queryRunner.query(`DROP TYPE "public"."ventas_formapago_enum"`);
        await queryRunner.query(`DROP TABLE "clientes"`);
    }

}
