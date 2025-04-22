
# Laboratorio de Workers con NestJS y MySQL

Este laboratorio demuestra el uso de workers (tareas en segundo plano) utilizando NestJS, Bull y MySQL.

## Requisitos previos

- Node.js v14 o superior
- MySQL instalado localmente
- Redis instalado localmente (necesario para Bull)

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/jaimeirazabal1/workers-with-nestjs.git
   cd workers
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura MySQL:
   ```bash
   # Inicia MySQL si no está corriendo
   mysql.server start

   # Crea la base de datos
   mysql -u root -p
   ```

   Dentro de MySQL ejecuta:
   ```sql
   CREATE DATABASE workers_lab;
   ```

   Asegúrate de que la configuración en `src/database/database.module.ts` coincida con tus credenciales locales.

## Ejecución

1. Inicia Redis (necesario para Bull):
   ```bash
   redis-server
   ```

2. Inicia la aplicación:
   ```bash
   npm run start:dev
   ```

3. La aplicación estará disponible en http://localhost:3000

## Pruebas del laboratorio

### 1. Crear tareas mediante la API REST

Crea una tarea simple:
```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"name": "Mi tarea", "description": "Descripción de la tarea"}'
```

Crea múltiples tareas en paralelo:
```bash
for i in {1..5}; do curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"name\": \"Tarea $i\", \"description\": \"Tarea en paralelo $i\"}"; echo ""; done
```

### 2. Consultar el estado de las tareas

Ver todas las tareas:
```bash
curl http://localhost:3000/tasks
```

Ver una tarea específica:
```bash
curl http://localhost:3000/tasks/1
```

### 3. Monitoreo visual con Bull Board

Accede al panel de administración de Bull en:
http://localhost:3000/admin/queues

Este panel te permitirá:
- Ver el estado de todas las colas
- Monitorear tareas pendientes, activas, completadas y fallidas
- Reintentar tareas fallidas
- Ver estadísticas de rendimiento

## Componentes principales

- `src/tasks/tasks.controller.ts`: API REST para gestionar tareas
- `src/tasks/tasks.service.ts`: Servicio que envía tareas a la cola
- `src/tasks/tasks.processor.ts`: Worker que procesa tareas en segundo plano
- `src/tasks/entities/task.entity.ts`: Modelo de datos para las tareas

## Arquitectura

1. El cliente hace una petición para crear una tarea
2. La API responde inmediatamente mientras añade la tarea a la cola
3. El worker procesa la tarea en segundo plano
4. La base de datos MySQL mantiene el estado actualizado de cada tarea
5. El cliente puede consultar el estado actual en cualquier momento
