# Diseño de la base de datos

El sistema APPBUS utiliza **PostgreSQL** como sistema gestor de base de datos relacional, complementado con la extensión **PostGIS** para el almacenamiento y consulta de datos geográficos. Esta elección permite gestionar de forma eficiente las coordenadas GPS de paradas y posiciones de autobuses, así como realizar consultas de proximidad geográfica para la funcionalidad de paradas cercanas. Entre las alternativas evaluadas, PostgreSQL fue seleccionado frente a MariaDB por su soporte nativo de tipos geográficos, imprescindibles para el correcto funcionamiento del sistema.

La base de datos se ha diseñado siguiendo un modelo relacional, con el objetivo de representar de forma clara y consistente los distintos elementos implicados en la gestión y monitorización del transporte urbano. El modelo da soporte tanto a la gestión operativa por parte de las empresas de transporte como al seguimiento en tiempo real de los autobuses, conductores, trayectos, incidencias y favoritos de los usuarios.

El diseño se ha planteado de forma modular y escalable, separando las entidades principales del sistema y sus relaciones, con el fin de facilitar la integridad de los datos, la evolución futura del sistema y la reutilización de la plataforma por distintas empresas de transporte.

---

## Entidades principales

### Empresa

La entidad Empresa representa a la organización responsable de gestionar el servicio de transporte. En ella se almacenan los datos básicos de identificación y acceso de cada empresa, como su nombre, correo electrónico, teléfono, contraseña cifrada y fecha de creación.

Una empresa puede gestionar múltiples conductores, líneas y autobuses.

### Conductor

La entidad Conductor almacena la información de los trabajadores encargados de operar los autobuses. Cada conductor pertenece a una empresa concreta y dispone de datos identificativos y de autenticación, como nombre, correo electrónico, DNI, número de trabajador, contraseña cifrada y fecha de creación.

Un conductor puede registrar fichajes, iniciar servicios y reportar incidencias.

### Registro_Fichaje

La entidad Registro_Fichaje permite almacenar los periodos de trabajo de cada conductor. Para cada fichaje se registra el conductor asociado, la fecha del registro, la hora de inicio de jornada y la hora de fin de jornada, que permanece nula hasta que el conductor cierra su turno.

Esta tabla permite mantener un histórico completo de actividad laboral de los conductores, siendo también útil para el panel de plantilla de la empresa.

### Bus

La entidad Bus representa cada vehículo físico disponible dentro de la empresa. Se almacenan datos como la matrícula, la empresa a la que pertenece, la última actualización registrada y si se encuentra o no en servicio.

El autobús se modela como una entidad independiente del conductor, ya que un mismo vehículo puede ser utilizado por distintos conductores en distintos momentos.

### Posicion_Bus

La entidad Posicion_Bus almacena el histórico de posiciones geográficas enviadas por cada autobús. Cada registro incluye el autobús asociado, su ubicación en formato geográfico PostGIS y la fecha y hora de la medición.

Esta tabla es fundamental para el seguimiento en tiempo real y para el cálculo posterior de tiempos estimados de llegada. La decisión de almacenar el histórico completo de posiciones, en lugar de únicamente la posición actual, permite conservar trazabilidad del recorrido y facilita futuras ampliaciones relacionadas con análisis de rutas o detección de desviaciones.

### Linea

La entidad Linea representa la línea comercial visible para el usuario, por ejemplo "L1" o "L12". Cada línea pertenece a una empresa y dispone de atributos como nombre, color y código identificativo.

Una línea puede contener varios trayectos distintos, normalmente asociados a los sentidos de ida y vuelta.

### Trayecto

La entidad Trayecto representa un recorrido concreto de una línea en un sentido determinado. Cada trayecto pertenece a una línea e incluye un origen, un destino, un estado de actividad y un sentido, que puede ser ida o vuelta.

Esta separación permite modelar correctamente casos donde una misma línea tiene recorridos diferentes según el sentido, lo cual resulta imprescindible para representar el comportamiento real del transporte urbano y evitar ambigüedades en la planificación horaria.

### Parada

La entidad Parada representa un punto físico de recogida o bajada de pasajeros. Cada parada almacena su nombre, dirección y ubicación geográfica en formato PostGIS.

Las paradas se modelan como entidades independientes de las empresas, ya que un mismo punto geográfico puede ser utilizado por distintas líneas. Su relación con los trayectos se gestiona a través de la tabla intermedia Trayecto_Parada.

### Trayecto_Parada

La entidad Trayecto_Parada resuelve la relación entre trayectos y paradas. Su función es indicar qué paradas forman parte de un trayecto concreto y en qué orden aparecen dentro del recorrido.

Esta tabla es esencial para reconstruir el itinerario de cada trayecto y para calcular la secuencia de paso de los autobuses por cada parada.

### Horario

La entidad Horario almacena la planificación horaria de los trayectos. Cada registro se asocia a un trayecto y a una parada concreta, e incluye la hora de llegada prevista y el tipo de día al que aplica: laborable (L-V), sábado o festivo. Esta distinción permite representar frecuencias distintas según el día de la semana, adaptándose a la operativa real de las empresas de transporte.

Esta tabla representa los horarios teóricos del sistema, diferenciándolos del seguimiento real obtenido a partir de la posición del autobús.

### Asignar_Servicio

La entidad Asignar_Servicio representa cada servicio operativo realizado por un conductor. En ella se registra qué conductor, qué autobús y qué trayecto quedan asociados durante un intervalo temporal determinado, definido por una fecha de inicio y una fecha de fin que permanece nula mientras el servicio está activo.

Esta tabla permite reflejar de forma correcta el funcionamiento real del sistema, ya que un conductor puede operar distintos autobuses y trayectos en días diferentes, y un mismo autobús puede participar en distintos servicios a lo largo del tiempo. Además, facilita consultas en tiempo real sobre qué conductor y trayecto están activos en cada momento.

### Incidencia

La entidad Incidencia almacena los eventos anómalos ocurridos durante la operación del servicio. Cada incidencia puede quedar asociada al conductor, al autobús y al trayecto implicados, e incluye información sobre el tipo de incidencia, descripción, estado, fecha de creación y fecha de resolución.

Los tipos de incidencia contemplados son: avería del autobús, incidencia con pasajero, emergencia médica y otras incidencias de texto libre. Esto permite mantener trazabilidad completa sobre cualquier evento relevante durante el servicio.

### Usuario

La entidad Usuario representa a los clientes finales de la aplicación. Se almacenan sus datos básicos de identificación y autenticación, como nombre, correo electrónico, contraseña cifrada y fecha de creación.

### Favorito

La entidad Favorito permite que un usuario guarde combinaciones concretas de trayecto y parada. Este diseño responde al flujo real de uso de la aplicación: el usuario selecciona una línea, elige un sentido concreto (ida o vuelta) y finalmente marca una parada de interés dentro de ese trayecto.

Gracias a esta estructura, un usuario puede guardar varios favoritos sobre una misma parada siempre que correspondan a trayectos diferentes. Se aplica una restricción de unicidad sobre la combinación usuario-trayecto-parada para evitar registros duplicados.

---

## Relaciones principales del modelo

Las relaciones más importantes del sistema son las siguientes:

- Una empresa tiene muchos conductores, líneas y autobuses.
- Una línea tiene varios trayectos, diferenciados por su sentido.
- Un trayecto está formado por varias paradas, relacionadas mediante Trayecto_Parada con un orden definido.
- Un trayecto tiene varios horarios, diferenciados por parada y tipo de día.
- Un autobús genera múltiples registros en Posicion_Bus a lo largo del servicio.
- Un conductor puede registrar múltiples fichajes a lo largo del tiempo.
- Un conductor puede iniciar múltiples servicios a lo largo del tiempo mediante Asignar_Servicio.
- Cada servicio relaciona un conductor, un autobús y un trayecto en un intervalo temporal concreto.
- Un usuario puede tener múltiples favoritos, cada uno identificado por la combinación trayecto-parada.
- Una incidencia puede asociarse a un conductor, autobús y trayecto concretos.

---

## Decisiones de diseño relevantes

Una de las decisiones más importantes del modelo ha sido separar los conceptos de línea y trayecto. Mientras que la línea representa la referencia comercial que ve el usuario, el trayecto permite distinguir recorridos concretos de ida y vuelta, lo cual resulta imprescindible para reflejar correctamente el comportamiento real del transporte urbano y evitar ambigüedades tanto en la planificación horaria como en el seguimiento en tiempo real.

Otra decisión relevante ha sido almacenar el seguimiento geográfico en una tabla independiente, Posicion_Bus, en lugar de guardar únicamente la posición actual del autobús. Esto permite conservar un histórico de ubicaciones y facilita futuras ampliaciones relacionadas con análisis de recorridos, detección de desviaciones o cálculo de tiempos estimados de llegada.

Asimismo, la entidad Asignar_Servicio se ha planteado como una tabla independiente para representar los servicios reales realizados por los conductores. Esta solución resulta más adecuada que asociar un conductor fijo a un autobús o a una línea, ya que refleja mejor la operativa diaria del sistema y permite mantener un histórico completo de todos los servicios realizados.

Por último, la entidad Favorito se ha diseñado alrededor de la combinación trayecto-parada, ya que este enfoque se ajusta mejor al flujo real de uso de la aplicación y permite a los usuarios guardar exactamente la información que desean seguir, distinguiendo incluso entre el sentido de ida y el de vuelta de una misma línea.

---

## Conclusión

El modelo de base de datos propuesto permite representar de forma consistente los elementos principales del sistema APPBUS y sus relaciones. La elección de PostgreSQL con PostGIS garantiza un soporte robusto para los datos geográficos del sistema, mientras que el diseño relacional proporciona una estructura sólida para el desarrollo posterior del backend, el seguimiento en tiempo real de los autobuses y la interacción de usuarios, conductores y empresas dentro de la plataforma.