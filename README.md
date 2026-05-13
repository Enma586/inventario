# Inventario API

REST API para gestión de inventario, ventas (DTE), compras, sucursales, usuarios y bitácora de auditoría. Backend puro — el frontend se conecta como cliente independiente.

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Base de datos | PostgreSQL |
| ORM | Sequelize 6 |
| Validación | Zod 4 |
| Autenticación | JWT (httpOnly cookie) |
| Tiempo real | Socket.IO 4 |
| API Docs | Swagger (`/api-docs`) |
| Testing | Vitest + Supertest |

---

## Arranque rápido

```bash
cp .env.example .env
# Editar .env con tus credenciales
npm install
npm run seed   # Carga departamentos/municipios/distritos de El Salvador
npm run dev    # http://localhost:<PORT>
```

Swagger UI disponible en `http://localhost:<PORT>/api-docs`.

---

## Variables de entorno (`.env`)

| Variable | Requerida | Default | Descripción |
|---|---|---|---|
| `PORT` | Sí | — | Puerto del servidor |
| `NODE_ENV` | Sí | — | `development` / `production` / `test` |
| `CORS_ORIGIN` | Sí | — | URL del frontend (ej. `http://localhost:5173`) |
| `DATABASE_URL` | Sí | — | `postgresql://user:pass@host:5432/inventario` |
| `JWT_SECRET` | No | `change-me-in-production` | Secreto para firmar JWT |
| `JWT_EXPIRES_IN` | No | `24h` | Duración del token |
| `JWT_REMEMBER_EXPIRES_IN` | No | `24h` | Duración con "remember me" |
| `JWT_ALGORITHM` | No | `HS256` | Algoritmo JWT |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Costo del hash bcrypt |
| `TZ` | No | `America/El_Salvador` | Zona horaria |

---

## Autenticación

### Flujo

1. **Login** (`POST /api/auth/login`) → el servidor setea una cookie `httpOnly` llamada `token` con el JWT.
2. El navegador **automáticamente** envía esa cookie en cada request subsiguiente.
3. **Logout** (`POST /api/auth/logout`) → el servidor limpia la cookie.

### Lo que el frontend debe hacer

- **Enviar credenciales siempre**: usa `credentials: 'include'` en `fetch` o `withCredentials: true` en axios.

```js
// fetch
fetch('/api/productos', { credentials: 'include' })

// axios
axios.get('/api/productos', { withCredentials: true })
```

- **No guardes el token manualmente**. La cookie `httpOnly` no es accesible desde JavaScript (protección XSS). El navegador la gestiona solo.
- **401** = token expirado o inválido → redirigir a login.
- **403** = no tienes permisos (rol insuficiente).

### Roles

| Rol | Crear | Editar | Eliminar | Ver bitácora |
|---|---|---|---|---|
| `ADMIN` | Todo | Todo | Todo | Sí |
| `EMPLEADO` | Casi todo | No | No | No |

El `EMPLEADO` **no puede** crear sucursales ni empleados, ni editar/eliminar nada.

---

## Formato de respuestas

### Éxito

```json
{
  "success": true,
  "data": { ... }
}
```

Listas paginadas incluyen metadatos:

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 150,
    "totalPages": 15,
    "currentPage": 1,
    "perPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    { "field": "email", "message": "El formato del email no es válido." }
  ]
}
```

Códigos HTTP: `400` validación, `401` no autenticado, `403` sin permisos, `404` no encontrado, `409` duplicado, `500` error interno.

---

## Paginación

Todas las rutas `GET` de lista aceptan:

| Query param | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | number | `1` | Página actual |
| `limit` | number | `10` | Resultados por página (máx. 1000) |
| `sort` | string | varía | Campo por el que ordenar |
| `order` | string | `DESC` | `ASC` o `DESC` |

---

## Manejo de dinero (IMPORTANTE)

**Todos los valores monetarios se envían y reciben en centavos (enteros).**

| Monto real | Valor en la API |
|---|---|
| $10.50 | `1050` |
| $0.75 | `75` |
| $1,500.00 | `150000` |

El frontend debe dividir entre 100 para mostrar y multiplicar por 100 para enviar.

---

## Socket.IO — Eventos en tiempo real

Conectarse a la misma URL del servidor con `withCredentials: true`:

```js
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000', { withCredentials: true })
```

### Eventos emitidos por el servidor

| Evento | Payload | Cuándo |
|---|---|---|
| `usuario:created` | `Usuario` | Nuevo usuario creado |
| `usuario:registered` | `{ usuario, empleado }` | Registro exitoso |
| `usuario:updated` | `Usuario` | Usuario editado |
| `usuario:deleted` | `Usuario` | Usuario eliminado |
| `empleado:created` | `Empleado` | Nuevo empleado |
| `empleado:updated` | `Empleado` | Empleado editado |
| `empleado:deleted` | `Empleado` | Empleado eliminado |
| `venta:created` | `Venta` (con `sucursal`, `empleado`, `detalles`) | Venta registrada |
| `venta:updated` | `Venta` | Venta modificada |
| `venta:cancelada` | `Venta` | Venta anulada (stock restaurado) |
| `compra:created` | `Compra` (con `proveedor`, `sucursal`, `detalles`) | Compra registrada |
| `compra:updated` | `Compra` | Compra modificada |
| `compra:cancelada` | `Compra` | Compra cancelada |
| `stock:created` | `Stock` | Stock registrado |
| `stock:updated` | `Stock` | Stock editado |
| `stock:deleted` | `Stock` | Stock eliminado |
| `stock:actualizado` | `{ id_sucursal }` | Stock afectado por venta/anulación |

---

## Endpoints

Todas las rutas parten de `/api`. Las marcadas con 🔒 requieren autenticación. Las marcadas con ⚡ requieren rol `ADMIN`.

---

### Auth

#### `POST /api/auth/login`

Body:

```json
{
  "email": "admin@example.com",
  "password": "secreto123",
  "rememberMe": false
}
```

Respuesta `200`:

```json
{
  "success": true,
  "token": "eyJhbG...",
  "data": {
    "usuario": {
      "id": "uuid",
      "nombre_usuario": "admin",
      "email": "admin@example.com",
      "rol": "ADMIN",
      "activo": true,
      "id_empleado": "uuid",
      "createdAt": "2026-05-12T...",
      "updatedAt": "2026-05-12T..."
    }
  }
}
```

La cookie `token` se setea automáticamente. `rememberMe: true` extiende la duración de la cookie a 30 días.

---

#### `POST /api/auth/register`

Body:

```json
{
  "usuario": {
    "nombre_usuario": "juanito",
    "email": "juan@example.com",
    "password": "secreto123",
    "rol": "EMPLEADO"
  },
  "empleado": {
    "nombres": "Juan",
    "apellidos": "Pérez",
    "dui": "12345678-9"
  }
}
```

`rol` es opcional (default `EMPLEADO`). Formato DUI: `########-#`.

Respuesta `201`:

```json
{
  "success": true,
  "message": "Cuenta creada exitosamente.",
  "data": {
    "usuario": { ... },
    "empleado": {
      "id": "uuid",
      "nombres": "Juan",
      "apellidos": "Pérez"
    }
  }
}
```

---

#### `POST /api/auth/logout` 🔒

Sin body. Respuesta `200`:

```json
{ "success": true, "message": "Sesión cerrada exitosamente" }
```

---

#### `GET /api/auth/me` 🔒

Respuesta `200`:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre_usuario": "admin",
    "email": "admin@example.com",
    "rol": "ADMIN",
    "activo": true,
    "id_empleado": "uuid",
    "empleado": {
      "id": "uuid",
      "nombres": "Admin",
      "apellidos": "Sistema",
      "dui": "00000000-0"
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### `GET /api/auth/verify` 🔒

Verifica que el token actual es válido. Misma respuesta que `/me`.

---

#### `GET /api/auth/renew` 🔒

Renueva el token (extiende la sesión). Setea nueva cookie. Respuesta `200`:

```json
{
  "success": true,
  "data": { "usuario": { ... } }
}
```

---

### Usuarios

#### `GET /api/usuarios` 🔒

Query params: `rol` (`ADMIN`|`EMPLEADO`), `activo` (`true`|`false`), `search`, `page`, `limit`.

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre_usuario": "juanito",
      "email": "juan@example.com",
      "rol": "EMPLEADO",
      "activo": true,
      "id_empleado": "uuid",
      "empleado": { "nombres": "Juan", "apellidos": "Pérez" },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/usuarios/:id` 🔒

Respuesta `200`: `{ "success": true, "data": { Usuario } }`

---

#### `POST /api/usuarios` 🔒 (ADMIN o EMPLEADO)

Body:

```json
{
  "id_empleado": "uuid-del-empleado",
  "nombre_usuario": "nuevo_usuario",
  "email": "nuevo@example.com",
  "password": "secreto123",
  "rol": "EMPLEADO",
  "activo": true
}
```

`rol` y `activo` son opcionales (default `EMPLEADO`, `true`).

Respuesta `201`: `{ "success": true, "data": { Usuario } }`

---

#### `PUT /api/usuarios/:id` 🔒 ⚡

Body (todos los campos opcionales):

```json
{
  "nombre_usuario": "nuevo_nick",
  "email": "nuevo@example.com",
  "password": "nueva_password",
  "rol": "ADMIN",
  "activo": false
}
```

Respuesta `200`: `{ "success": true, "data": { Usuario } }`

---

#### `DELETE /api/usuarios/:id` 🔒 ⚡

Respuesta `200`: `{ "success": true, "data": { Usuario } }`

---

### Empleados

#### `GET /api/empleados` 🔒

Query params: `search`, `page`, `limit`, `sort`, `order`.

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombres": "Juan",
      "apellidos": "Pérez",
      "dui": "12345678-9",
      "usuario": { ... },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/empleados/:id` 🔒

Respuesta `200`: `{ "success": true, "data": { Empleado } }`

---

#### `POST /api/empleados` 🔒 ⚡

Body:

```json
{
  "nombres": "María",
  "apellidos": "Gómez",
  "dui": "87654321-0"
}
```

Respuesta `201`: `{ "success": true, "data": { Empleado } }`

---

#### `PUT /api/empleados/:id` 🔒 ⚡

Body (todos los campos opcionales):

```json
{
  "nombres": "María José",
  "apellidos": "Gómez López",
  "dui": "87654321-0"
}
```

Respuesta `200`: `{ "success": true, "data": { Empleado } }`

---

#### `DELETE /api/empleados/:id` 🔒 ⚡

Respuesta `200`: `{ "success": true, "data": { Empleado } }`

---

### Categorías

#### `GET /api/categorias` 🔒

Query params: `search`, `page`, `limit`.

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Electrónicos",
      "descripcion": "Productos electrónicos",
      "productos": [ ... ],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/categorias/:id` 🔒

Respuesta `200`: `{ "success": true, "data": { Categoria } }`

---

#### `POST /api/categorias` 🔒 (ADMIN o EMPLEADO)

Body:

```json
{
  "nombre": "Oficina",
  "descripcion": "Artículos de oficina"
}
```

`descripcion` es opcional.

Respuesta `201`: `{ "success": true, "data": { Categoria } }`

---

#### `PUT /api/categorias/:id` 🔒 ⚡

Body (todos los campos opcionales):

```json
{
  "nombre": "Oficina y Papelería",
  "descripcion": "Artículos de oficina y papelería"
}
```

Respuesta `200`: `{ "success": true, "data": { Categoria } }`

---

#### `DELETE /api/categorias/:id` 🔒 ⚡

Respuesta `200`: `{ "success": true, "data": { Categoria } }`

---

### Proveedores

#### `GET /api/proveedores` 🔒

Query params: `search`, `page`, `limit`.

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Distribuidora XYZ",
      "contacto": "5555-1234",
      "productos": [ ... ],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/proveedores/:id` 🔒

Respuesta `200`: `{ "success": true, "data": { Proveedor } }`

---

#### `POST /api/proveedores` 🔒 (ADMIN o EMPLEADO)

Body:

```json
{
  "nombre": "Distribuidora XYZ",
  "contacto": "ventas@xyz.com"
}
```

`contacto` es opcional.

Respuesta `201`: `{ "success": true, "data": { Proveedor } }`

---

#### `PUT /api/proveedores/:id` 🔒 ⚡

Body (todos los campos opcionales):

```json
{
  "nombre": "Distribuidora XYZ S.A.",
  "contacto": "5555-9999"
}
```

Respuesta `200`: `{ "success": true, "data": { Proveedor } }`

---

#### `DELETE /api/proveedores/:id` 🔒 ⚡

Respuesta `200`: `{ "success": true, "data": { Proveedor } }`

---

### Productos

#### `GET /api/productos` 🔒

Query params:

| Param | Tipo | Descripción |
|---|---|---|
| `search` | string | Busca en `sku` y `nombre` |
| `estado` | string | `DISPONIBLE` / `DESCONTINUADO` / `AGOTADO` |
| `id_categoria` | UUID | Filtrar por categoría |
| `id_proveedor` | UUID | Filtrar por proveedor |
| `precioMin` | number | Precio mínimo (centavos) |
| `precioMax` | number | Precio máximo (centavos) |
| `page` | number | Página (default 1) |
| `limit` | number | Por página (default 10) |

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sku": "PROD-001",
      "nombre": "Laptop HP",
      "id_categoria": "uuid",
      "id_proveedor": "uuid",
      "estado": "DISPONIBLE",
      "costo_compra": 75000,
      "precio_venta": 95000,
      "categoria": { "id": "uuid", "nombre": "Electrónicos" },
      "proveedor": { "id": "uuid", "nombre": "Distribuidora XYZ" },
      "stocks": [
        { "id_producto": "uuid", "id_sucursal": "uuid", "cantidad": 15, "sucursal": { "nombre": "Sucursal Centro" } }
      ],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/productos/:id` 🔒

Respuesta `200`: `{ "success": true, "data": { Producto } }`

---

#### `POST /api/productos` 🔒 (ADMIN o EMPLEADO)

Body:

```json
{
  "sku": "PROD-001",
  "nombre": "Laptop HP",
  "id_categoria": "uuid-categoria",
  "id_proveedor": "uuid-proveedor",
  "estado": "DISPONIBLE",
  "costo_compra": 75000,
  "precio_venta": 95000
}
```

`id_categoria`, `id_proveedor`, `estado`, `costo_compra`, `precio_venta` son opcionales.
`estado` default: `DISPONIBLE`. Costos/precios default: `0`.

Respuesta `201`: `{ "success": true, "data": { Producto } }`

---

#### `PUT /api/productos/:id` 🔒 ⚡

Body (todos los campos opcionales):

```json
{
  "sku": "PROD-001",
  "nombre": "Laptop HP 15.6\"",
  "id_categoria": "uuid",
  "id_proveedor": "uuid",
  "estado": "DESCONTINUADO",
  "costo_compra": 70000,
  "precio_venta": 90000
}
```

Respuesta `200`: `{ "success": true, "data": { Producto } }`

---

#### `DELETE /api/productos/:id` 🔒 ⚡

Respuesta `200`: `{ "success": true, "data": { Producto } }`

---

### Sucursales

#### `GET /api/sucursales` 🔒

Query params: `search`, `id_distrito` (UUID), `activa` (`true`|`false`), `page`, `limit`.

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "id_distrito": "uuid",
      "nombre": "Sucursal Centro",
      "direccion": "Calle Principal #123",
      "activa": true,
      "distrito": { "id": "uuid", "nombre": "San Salvador", "municipio": { ... } },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/sucursales/:id` 🔒

Respuesta `200`: `{ "success": true, "data": { Sucursal } }`

---

#### `POST /api/sucursales` 🔒 ⚡

Body:

```json
{
  "id_distrito": "uuid-del-distrito",
  "nombre": "Sucursal Norte",
  "direccion": "Av. Norte #456",
  "activa": true
}
```

`activa` es opcional (default `true`).

Respuesta `201`: `{ "success": true, "data": { Sucursal } }`

---

#### `PUT /api/sucursales/:id` 🔒 ⚡

Body (todos los campos opcionales):

```json
{
  "id_distrito": "uuid",
  "nombre": "Sucursal Norte Ampliada",
  "direccion": "Av. Norte #456-A",
  "activa": false
}
```

Respuesta `200`: `{ "success": true, "data": { Sucursal } }`

---

#### `DELETE /api/sucursales/:id` 🔒 ⚡

Respuesta `200`: `{ "success": true, "data": { Sucursal } }`

---

### Stock (Inventario por sucursal)

#### `GET /api/stocks` 🔒

Query params:

| Param | Tipo | Descripción |
|---|---|---|
| `id_sucursal` | UUID | Filtrar por sucursal |
| `id_producto` | UUID | Filtrar por producto |
| `stockBajo` | number | Stock menor o igual a este valor |
| `sinStock` | `true`/`false` | Solo productos con `cantidad === 0` |
| `page`, `limit` | number | Paginación |

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id_producto": "uuid",
      "id_sucursal": "uuid",
      "cantidad": 25,
      "producto": { "id": "uuid", "sku": "PROD-001", "nombre": "Laptop HP" },
      "sucursal": { "id": "uuid", "nombre": "Sucursal Centro" },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/stocks/bajo` 🔒

Query params: `limite` (default `5`). Retorna productos con cantidad ≤ límite.

Respuesta `200`: `{ "success": true, "data": [ ... ] }`

---

#### `GET /api/stocks/:id_producto/:id_sucursal` 🔒

Respuesta `200`: `{ "success": true, "data": { Stock } }`

---

#### `POST /api/stocks` 🔒 (ADMIN o EMPLEADO)

**Upsert**: si el par producto/sucursal ya existe, actualiza la cantidad; si no, lo crea.

Body:

```json
{
  "id_producto": "uuid-producto",
  "id_sucursal": "uuid-sucursal",
  "cantidad": 50
}
```

`cantidad` es opcional (default `0`). Respuesta `201` (creado) o `200` (actualizado).

---

#### `PUT /api/stocks/:id_producto/:id_sucursal` 🔒 ⚡

Body:

```json
{ "cantidad": 75 }
```

Respuesta `200`: `{ "success": true, "data": { Stock } }`

---

#### `DELETE /api/stocks/:id_producto/:id_sucursal` 🔒 ⚡

Respuesta `200`: `{ "success": true, "data": { Stock } }`

---

### Ventas

**Solo el endpoint de creación (`POST /api/ventas`) acepta cabecera + detalles juntos.**
Para crear una venta **siempre** usa este endpoint.

#### `GET /api/ventas` 🔒

Query params:

| Param | Tipo | Descripción |
|---|---|---|
| `search` | string | Busca en `numero_factura`, `cliente_nombre`, `cliente_nit` |
| `estado` | string | `PENDIENTE` / `RECIBIDO` / `CANCELADO` |
| `estado_dte` | string | `PENDIENTE` / `PROCESANDO` / `RECHAZADO` / `CONTINGENCIA` / `RECIBIDO` / `ANULADO` |
| `metodo_pago` | string | `EFECTIVO` / `TARJETA_CREDITO` / `TRANSFERENCIA_BANCARIA` |
| `id_sucursal` | UUID | Filtrar por sucursal |
| `id_empleado` | UUID | Filtrar por empleado |
| `fechaDesde` | date | Fecha mínima |
| `fechaHasta` | date | Fecha máxima |
| `page`, `limit` | number | Paginación |

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "numero_factura": "A3C4-01-0000000001",
      "id_sucursal": "uuid",
      "id_empleado": "uuid",
      "cliente_nombre": "Carlos López",
      "cliente_nit": "0614-120586-001-8",
      "cliente_email": "carlos@example.com",
      "fecha": "2026-05-12T00:00:00.000Z",
      "total_pagado": 9500,
      "metodo_pago": "EFECTIVO",
      "estado": "PENDIENTE",
      "estado_dte": "PENDIENTE",
      "codigo_generacion": null,
      "sello_recepcion": null,
      "sucursal": { "nombre": "Sucursal Centro" },
      "empleado": { "nombres": "Juan", "apellidos": "Pérez" },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/ventas/:id` 🔒

Incluye los `detalles` de la venta.

Respuesta `200`:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "numero_factura": "A3C4-01-0000000001",
    "id_sucursal": "uuid",
    "id_empleado": "uuid",
    "cliente_nombre": "Carlos López",
    "cliente_nit": "0614-120586-001-8",
    "cliente_email": "carlos@example.com",
    "fecha": "2026-05-12T00:00:00.000Z",
    "total_pagado": 9500,
    "metodo_pago": "EFECTIVO",
    "estado": "PENDIENTE",
    "estado_dte": "PENDIENTE",
    "codigo_generacion": null,
    "sello_recepcion": null,
    "sucursal": { ... },
    "empleado": { ... },
    "detalles": [
      {
        "id": "uuid",
        "id_venta": "uuid",
        "id_producto": "uuid",
        "nombre_snapshot": "Laptop HP",
        "precio_unitario_venta": 9500,
        "cantidad": 1,
        "subtotal": 9500
      }
    ]
  }
}
```

---

#### `POST /api/ventas` 🔒 (ADMIN o EMPLEADO)

Crea venta + detalles + descuenta stock **en una sola transacción**.

Body:

```json
{
  "venta": {
    "numero_factura": "FAC-001",
    "id_sucursal": "uuid-sucursal",
    "id_empleado": "uuid-empleado",
    "cliente_nombre": "Carlos López",
    "cliente_nit": "0614-120586-001-8",
    "cliente_email": "carlos@example.com",
    "fecha": "2026-05-12",
    "total_pagado": 9500,
    "metodo_pago": "EFECTIVO",
    "estado": "PENDIENTE",
    "estado_dte": "PENDIENTE",
    "codigo_generacion": null,
    "sello_recepcion": null
  },
  "detalles": [
    {
      "id_producto": "uuid-producto",
      "precio_unitario_venta": 9500,
      "cantidad": 1
    }
  ]
}
```

Campos requeridos: `id_sucursal`, `id_empleado`, `cliente_nombre`, `cliente_nit`, `metodo_pago`, y al menos un detalle con `id_producto`, `precio_unitario_venta`, `cantidad`.

`numero_factura` se autogenera si no se envía (formato DTE: `XXXX-01-NNNNNNNNNN`).
`fecha` default: hoy.
`total_pagado` se calcula automáticamente de los detalles (el valor enviado se ignora).
`nombre_snapshot` en los detalles se autocompleta del nombre del producto.
`subtotal` se calcula automáticamente (`cantidad × precio_unitario_venta`).
El **stock se descuenta automáticamente** al crear la venta.

Respuesta `201`:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "numero_factura": "A3C4-01-0000000001",
    "id_sucursal": "uuid",
    "id_empleado": "uuid",
    "cliente_nombre": "Carlos López",
    "cliente_nit": "0614-120586-001-8",
    "cliente_email": "carlos@example.com",
    "fecha": "2026-05-12",
    "total_pagado": 9500,
    "metodo_pago": "EFECTIVO",
    "estado": "PENDIENTE",
    "estado_dte": "PENDIENTE",
    "codigo_generacion": null,
    "sello_recepcion": null,
    "sucursal": { "nombre": "Sucursal Centro" },
    "empleado": { ... },
    "detalles": [ ... ]
  }
}
```

---

#### `PUT /api/ventas/:id` 🔒 ⚡

**Solo actualiza cabecera** (campos DTE y transaccionales). No modifica detalles.

Body (todos los campos opcionales):

```json
{
  "estado": "RECIBIDO",
  "estado_dte": "RECIBIDO",
  "codigo_generacion": "ABC123",
  "sello_recepcion": "SELLO456",
  "total_pagado": 9500,
  "metodo_pago": "TRANSFERENCIA_BANCARIA"
}
```

No se puede modificar una venta con `estado: CANCELADO`.

Respuesta `200`: `{ "success": true, "data": { Venta } }`

---

#### `PUT /api/ventas/:id/anular` 🔒 ⚡

Anula la venta y **restaura el stock**. No requiere body.

Respuesta `200`: `{ "success": true, "data": { Venta } }`

---

### Venta Detalles

Estas rutas permiten manejar detalles individualmente si se necesita, pero lo normal es usar `POST /api/ventas` para crear todo junto.

#### `POST /api/ventas/:idVenta/detalles` 🔒

Body:

```json
{
  "id_venta": "uuid-venta",
  "id_producto": "uuid-producto",
  "nombre_snapshot": "Laptop HP 15.6\"",
  "precio_unitario_venta": 9500,
  "cantidad": 2,
  "subtotal": 19000
}
```

---

#### `PUT /api/ventas/:idVenta/detalles/:id` 🔒

Body (todos los campos opcionales):

```json
{
  "precio_unitario_venta": 9000,
  "cantidad": 1,
  "subtotal": 9000
}
```

---

#### `DELETE /api/ventas/:idVenta/detalles/:id` 🔒

Respuesta `200`: `{ "success": true, "data": { VentaDetalle } }`

---

### Compras

**Mismo patrón que ventas**: usa `POST /api/compras` para crear cabecera + detalles juntos.

#### `GET /api/compras` 🔒

Query params:

| Param | Tipo | Descripción |
|---|---|---|
| `search` | string | Busca en `numero_orden` |
| `estado_entrega` | string | `PENDIENTE` / `RECIBIDO` / `CANCELADO` |
| `id_proveedor` | UUID | Filtrar por proveedor |
| `id_sucursal` | UUID | Filtrar por sucursal |
| `fechaDesde` | date | Fecha mínima |
| `fechaHasta` | date | Fecha máxima |
| `page`, `limit` | number | Paginación |

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "numero_orden": "OC-A3C4-20260512-0001",
      "id_proveedor": "uuid",
      "id_sucursal": "uuid",
      "total_compra": 75000,
      "estado_entrega": "PENDIENTE",
      "proveedor": { "id": "uuid", "nombre": "Distribuidora XYZ" },
      "sucursal": { "nombre": "Sucursal Centro" },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/compras/:id` 🔒

Incluye los `detalles`.

Respuesta `200`:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "numero_orden": "OC-A3C4-20260512-0001",
    "id_proveedor": "uuid",
    "id_sucursal": "uuid",
    "total_compra": 75000,
    "estado_entrega": "PENDIENTE",
    "proveedor": { ... },
    "sucursal": { ... },
    "detalles": [
      {
        "id": "uuid",
        "id_compra": "uuid",
        "id_producto": "uuid",
        "cantidad": 10,
        "costo_unitario": 7500
      }
    ]
  }
}
```

---

#### `POST /api/compras` 🔒 (ADMIN o EMPLEADO)

Crea compra + detalles en **una sola transacción**. **No incrementa el stock** (debe hacerse manualmente al recibir la mercancía).

Body:

```json
{
  "compra": {
    "numero_orden": "OC-MANUAL",
    "id_proveedor": "uuid-proveedor",
    "id_sucursal": "uuid-sucursal",
    "total_compra": 75000,
    "estado_entrega": "PENDIENTE"
  },
  "detalles": [
    {
      "id_producto": "uuid-producto",
      "cantidad": 10,
      "costo_unitario": 7500
    }
  ]
}
```

`numero_orden` se autogenera si no se envía (formato `OC-XXXX-YYYYMMDD-NNNN`).
`total_compra` se calcula automáticamente de los detalles.
`estado_entrega` default: `PENDIENTE`.

Respuesta `201`:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "numero_orden": "OC-A3C4-20260512-0001",
    "id_proveedor": "uuid",
    "id_sucursal": "uuid",
    "total_compra": 75000,
    "estado_entrega": "PENDIENTE",
    "proveedor": { ... },
    "sucursal": { ... },
    "detalles": [ ... ]
  }
}
```

---

#### `PUT /api/compras/:id` 🔒 ⚡

Body (todos los campos opcionales):

```json
{
  "total_compra": 80000,
  "estado_entrega": "RECIBIDO"
}
```

No se puede modificar una compra con `estado_entrega: CANCELADO`.

Respuesta `200`: `{ "success": true, "data": { Compra } }`

---

#### `PUT /api/compras/:id/cancelar` 🔒 ⚡

Cancela la compra. No requiere body.

Respuesta `200`: `{ "success": true, "data": { Compra } }`

---

### Compra Detalles

#### `POST /api/compras/:idCompra/detalles` 🔒

Body:

```json
{
  "id_compra": "uuid-compra",
  "id_producto": "uuid-producto",
  "cantidad": 5,
  "costo_unitario": 7500
}
```

---

#### `PUT /api/compras/:idCompra/detalles/:id` 🔒

Body (todos los campos opcionales):

```json
{
  "cantidad": 8,
  "costo_unitario": 7000
}
```

---

#### `DELETE /api/compras/:idCompra/detalles/:id` 🔒

Respuesta `200`: `{ "success": true, "data": { CompraDetalle } }`

---

### Bitácora (Auditoría)

**Solo ADMIN.**

#### `GET /api/bitacora` 🔒 ⚡

Query params: `accion` (`CREATE`|`UPDATE`|`DELETE`), `entidad` (`Usuario`|`Empleado`|`Producto`|`Categoria`|`Proveedor`|`Sucursal`|`Stock`|`Venta`|`VentaDetalle`|`Compra`|`CompraDetalle`), `page`, `limit`.

Respuesta `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "id_usuario": "uuid",
      "accion": "CREATE",
      "entidad": "Producto",
      "entidad_id": "uuid",
      "detalles": { "sku": "PROD-001", "nombre": "Laptop HP" },
      "ip": "::1",
      "navegador": "Mozilla/5.0 ...",
      "createdAt": "2026-05-12T19:15:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

## Modelos de datos (referencia rápida)

### Usuario
`id`, `id_empleado` (FK), `nombre_usuario` (unique), `email` (unique), `password` (hashed, nunca se devuelve), `rol` (`ADMIN`|`EMPLEADO`), `activo` (boolean), timestamps.

### Empleado
`id`, `nombres`, `apellidos`, `dui` (unique, formato `########-#`), timestamps.

### Categoría
`id`, `nombre` (unique), `descripcion`, timestamps.

### Proveedor
`id`, `nombre`, `contacto`, timestamps.

### Producto
`id`, `sku` (unique), `nombre`, `id_categoria` (FK), `id_proveedor` (FK), `estado` (`DISPONIBLE`|`DESCONTINUADO`|`AGOTADO`), `costo_compra` (centavos), `precio_venta` (centavos), timestamps.

### Sucursal
`id`, `id_distrito` (FK), `nombre` (unique), `direccion`, `activa` (boolean), timestamps.

### Stock (clave compuesta: `id_producto` + `id_sucursal`)
`id_producto` (FK), `id_sucursal` (FK), `cantidad` (≥0), timestamps.

### Venta (cabecera DTE)
`id`, `numero_factura` (unique, autogenerado), `id_sucursal` (FK), `id_empleado` (FK), `cliente_nombre`, `cliente_nit`, `cliente_email`, `fecha`, `total_pagado` (centavos), `metodo_pago` (`EFECTIVO`|`TARJETA_CREDITO`|`TRANSFERENCIA_BANCARIA`), `estado` (`PENDIENTE`|`RECIBIDO`|`CANCELADO`), `estado_dte`, `codigo_generacion`, `sello_recepcion`, timestamps.

### VentaDetalle
`id`, `id_venta` (FK), `id_producto` (FK), `nombre_snapshot`, `precio_unitario_venta` (centavos), `cantidad` (≥1), `subtotal` (centavos), timestamps.

### Compra (orden de compra)
`id`, `numero_orden` (unique, autogenerado), `id_proveedor` (FK), `id_sucursal` (FK), `total_compra` (centavos), `estado_entrega` (`PENDIENTE`|`RECIBIDO`|`CANCELADO`), timestamps.

### CompraDetalle
`id`, `id_compra` (FK), `id_producto` (FK), `cantidad` (≥1), `costo_unitario` (centavos), timestamps.

### Bitácora
`id`, `id_usuario` (FK), `accion` (`CREATE`|`UPDATE`|`DELETE`), `entidad` (nombre del modelo), `entidad_id` (UUID), `detalles` (JSONB con el body del request), `ip`, `navegador`, `createdAt`.

### Ubicación (El Salvador)
`Departamento` → `Municipio` → `Distrito`. Datos precargados con `npm run seed`.
