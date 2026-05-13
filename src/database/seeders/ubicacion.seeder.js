/**
 * @file src/database/seeders/ubicacion.seeder.js
 * @description Pobla departamentos, municipios y distritos de El Salvador
 *              según la reorganización territorial de 2024 (14 deptos → 44 munis → 262 distritos).
 *
 * Uso: npm run seed
 */

import sequelize from '../../config/db.js';
import models from '../../models/index.js';

const { Departamento, Municipio, Distrito } = models;

// ─── Datos completos ─────────────────────────────────────────────
const data = [
  // ════════════════════════════════════════════════════════════════
  // 01. AHUACHAPÁN
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'Ahuachapán',
    municipios: [
      {
        nombre: 'Ahuachapán Centro',
        distritos: ['Ahuachapán', 'Apaneca', 'Concepción de Ataco', 'Tacuba'],
      },
      {
        nombre: 'Ahuachapán Norte',
        distritos: ['Atiquizaya', 'El Refugio', 'San Lorenzo', 'Turín'],
      },
      {
        nombre: 'Ahuachapán Sur',
        distritos: ['Guaymango', 'Jujutla', 'San Francisco Menéndez', 'San Pedro Puxtla'],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 02. SANTA ANA
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'Santa Ana',
    municipios: [
      {
        nombre: 'Santa Ana Centro',
        distritos: ['Santa Ana'],
      },
      {
        nombre: 'Santa Ana Este',
        distritos: ['Coatepeque', 'El Congo', 'Texistepeque'],
      },
      {
        nombre: 'Santa Ana Norte',
        distritos: [
          'Candelaria de la Frontera', 'Chalchuapa', 'Masahuat',
          'San Antonio Pajonal', 'San Sebastián Salitrillo', 'Santiago de la Frontera',
        ],
      },
      {
        nombre: 'Santa Ana Oeste',
        distritos: ['Metapán', 'Santa Rosa Guachipilín'],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 03. SONSONATE
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'Sonsonate',
    municipios: [
      {
        nombre: 'Sonsonate Centro',
        distritos: ['Sonsonate', 'Sonzacate'],
      },
      {
        nombre: 'Sonsonate Este',
        distritos: [
          'Armenia', 'Caluco', 'Cuisnahuat', 'Izalco',
          'San Julián', 'Santa Isabel Ishuatán',
        ],
      },
      {
        nombre: 'Sonsonate Norte',
        distritos: [
          'Juayúa', 'Nahuizalco', 'Salcoatitán', 'San Antonio del Monte',
          'Santa Catarina Masahuat', 'Santo Domingo de Guzmán',
        ],
      },
      {
        nombre: 'Sonsonate Oeste',
        distritos: ['Acajutla', 'Nahulingo'],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 04. CHALATENANGO
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'Chalatenango',
    municipios: [
      {
        nombre: 'Chalatenango Centro',
        distritos: [
          'Chalatenango', 'Concepción Quezaltepeque', 'El Carrizal',
          'Las Vueltas', 'Ojos de Agua', 'San Antonio Los Ranchos',
          'San Isidro Labrador',
        ],
      },
      {
        nombre: 'Chalatenango Norte',
        distritos: [
          'Arcatao', 'Citalá', 'Dulce Nombre de María', 'La Laguna',
          'La Palma', 'Las Flores', 'Nueva Concepción', 'Nueva Trinidad',
          'San Fernando', 'San Francisco Morazán', 'San Ignacio',
          'San José Cancasque', 'San Miguel de Mercedes',
        ],
      },
      {
        nombre: 'Chalatenango Sur',
        distritos: [
          'Agua Caliente', 'Azacualpa', 'Comalapa', 'El Paraíso',
          'La Reina', 'Nombre de Jesús', 'Potonico', 'San Antonio de la Cruz',
          'San Francisco Lempa', 'San Luis del Carmen', 'San Rafael',
          'Santa Rita', 'Tejutla',
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 05. LA LIBERTAD
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'La Libertad',
    municipios: [
      {
        nombre: 'La Libertad Centro',
        distritos: [
          'Antiguo Cuscatlán', 'Ciudad Arce', 'Colón', 'Nuevo Cuscatlán',
          'San Juan Opico', 'Santa Tecla',
        ],
      },
      {
        nombre: 'La Libertad Costa',
        distritos: ['Chiltiupán', 'Jicalapa', 'La Libertad', 'Tamanique', 'Teotepeque'],
      },
      {
        nombre: 'La Libertad Este',
        distritos: ['Huizúcar', 'San José Villanueva', 'Zaragoza'],
      },
      {
        nombre: 'La Libertad Norte',
        distritos: ['Quezaltepeque', 'San Matías', 'San Pablo Tacachico'],
      },
      {
        nombre: 'La Libertad Oeste',
        distritos: ['Comasagua', 'Jayaque', 'Talnique', 'Tepecoyo'],
      },
      {
        nombre: 'La Libertad Sur',
        distritos: ['Sacacoyo', 'San Juan Talpa', 'San Pedro Masahuat'],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 06. SAN SALVADOR
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'San Salvador',
    municipios: [
      {
        nombre: 'San Salvador Centro',
        distritos: [
          'Ayutuxtepeque', 'Cuscatancingo', 'Delgado', 'Ilopango',
          'Mejicanos', 'San Marcos', 'San Martín', 'San Salvador',
          'Soyapango', 'Tonacatepeque',
        ],
      },
      {
        nombre: 'San Salvador Este',
        distritos: ['Aguilares', 'El Paisnal', 'Guazapa'],
      },
      {
        nombre: 'San Salvador Norte',
        distritos: ['Apopa', 'Nejapa'],
      },
      {
        nombre: 'San Salvador Oeste',
        distritos: ['Panchimalco', 'Rosario de Mora', 'Santo Tomás', 'Santiago Texacuangos'],
      },
      {
        nombre: 'San Salvador Sur',
        distritos: ['San Bartolo', 'San Marcos', 'San Miguelito', 'Santa Cruz Michapa'],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 07. CUSCATLÁN
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'Cuscatlán',
    municipios: [
      {
        nombre: 'Cuscatlán Norte',
        distritos: [
          'Cojutepeque', 'El Carmen', 'Monte San Juan',
          'Oratorio de Concepción', 'San Cristóbal', 'San José Guayabal',
          'San Pedro Perulapán', 'San Rafael Cedros', 'Santa Cruz Analquito',
          'Suchitoto', 'Tenancingo',
        ],
      },
      {
        nombre: 'Cuscatlán Sur',
        distritos: [
          'Candelaria', 'El Rosario', 'San Bartolomé Perulapía',
          'San Pedro Perulapán', 'San Ramón',
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 08. LA PAZ
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'La Paz',
    municipios: [
      {
        nombre: 'La Paz Centro',
        distritos: [
          'El Rosario', 'Jerusalén', 'San Juan Tepezontes',
          'San Luis La Herradura', 'San Miguel Tepezontes',
          'San Pedro Masahuat', 'Santiago Nonualco', 'Zacatecoluca',
        ],
      },
      {
        nombre: 'La Paz Este',
        distritos: [
          'Cuyultitán', 'Mercedes La Ceiba', 'Olocuilta',
          'San Antonio Masahuat', 'San Francisco Chinameca',
          'San Juan Talpa', 'San Luis Talpa', 'Tapalhuaca',
        ],
      },
      {
        nombre: 'La Paz Oeste',
        distritos: [
          'Paraíso de Osorio', 'San Emigdio', 'San Juan Nonualco',
          'San Pedro Nonualco', 'Santa María Ostuma',
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 09. CABAÑAS
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'Cabañas',
    municipios: [
      {
        nombre: 'Cabañas Este',
        distritos: [
          'Cinquera', 'Dolores', 'Guacotecti', 'Ilobasco',
          'Jutiapa', 'San Isidro', 'Sensuntepeque', 'Tejutepeque',
          'Victoria',
        ],
      },
      {
        nombre: 'Cabañas Oeste',
        distritos: ['San Sebastián'],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 10. SAN VICENTE
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'San Vicente',
    municipios: [
      {
        nombre: 'San Vicente Norte',
        distritos: [
          'Apastepeque', 'San Esteban Catarina', 'San Ildefonso',
          'San Lorenzo', 'San Sebastián', 'Santa Clara',
          'Santo Domingo', 'Tecoluca', 'Verapaz',
        ],
      },
      {
        nombre: 'San Vicente Sur',
        distritos: [
          'Guadalupe', 'San Cayetano Istepeque',
          'San Juan Lolotique', 'San Luis de la Reina',
          'San Rafael Cedros', 'Tecoluca',
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 11. USULUTÁN
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'Usulután',
    municipios: [
      {
        nombre: 'Usulután Este',
        distritos: [
          'Alegría', 'Berlín', 'El Triunfo', 'Estanzuelas',
          'Jiquilisco', 'Mercedes Umaña', 'Nueva Granada',
          'San Buenaventura', 'San Dionisio', 'San José', 'Usulután',
        ],
      },
      {
        nombre: 'Usulután Norte',
        distritos: [
          'California', 'Concepción Batres', 'Ereguayquín',
          'Jucuapa', 'Jucuarán', 'Ozatlán', 'Puerto El Triunfo',
          'San Agustín', 'Santa Elena', 'Santiago de María',
          'Tecapán',
        ],
      },
      {
        nombre: 'Usulután Oeste',
        distritos: [
          'Alegría', 'Berlín', 'Mercedes Umaña', 'San Francisco Javier',
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 12. SAN MIGUEL
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'San Miguel',
    municipios: [
      {
        nombre: 'San Miguel Centro',
        distritos: [
          'Chinameca', 'Chirilagua', 'Ciudad Barrios',
          'El Tránsito', 'Moncagua', 'Nueva Guadalupe',
          'San Jorge', 'San Miguel', 'San Rafael Oriente',
          'Sesori',
        ],
      },
      {
        nombre: 'San Miguel Este',
        distritos: ['Carolina', 'Chapeltique', 'Lolotique', 'San Antonio del Mosco'],
      },
      {
        nombre: 'San Miguel Norte',
        distritos: ['Ciudad Barrios', 'San Gerardo', 'Sesori'],
      },
      {
        nombre: 'San Miguel Oeste',
        distritos: ['Comacarán', 'Quelepa', 'San Jorge', 'Uluazapa'],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 13. MORAZÁN
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'Morazán',
    municipios: [
      {
        nombre: 'Morazán Norte',
        distritos: [
          'Arambala', 'Cacaopera', 'Corinto', 'Delicias de Concepción',
          'El Divisadero', 'El Rosario', 'Gualococti', 'Guatajiagua',
          'Joateca', 'Jocoaitique', 'Jocoro', 'Meanguera',
          'Osicala', 'Perquín', 'San Carlos', 'San Fernando',
          'San Francisco Gotera', 'San Isidro', 'San Simón',
          'Sensembra', 'Torola', 'Yamabal', 'Yoloaiquín',
        ],
      },
      {
        nombre: 'Morazán Sur',
        distritos: [
          'Chilanga', 'Lolotiquillo', 'San Francisco Gotera',
          'Sociedad',
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 14. LA UNIÓN
  // ════════════════════════════════════════════════════════════════
  {
    nombre: 'La Unión',
    municipios: [
      {
        nombre: 'La Unión Norte',
        distritos: [
          'Anamorós', 'Bolívar', 'Concepción de Oriente',
          'El Sauce', 'Lislique', 'Nueva Esparta', 'Pasaquina',
          'Polorós', 'San José', 'Santa Rosa de Lima',
        ],
      },
      {
        nombre: 'La Unión Sur',
        distritos: [
          'Conchagua', 'El Carmen', 'Intipucá', 'La Unión',
          'Meanguera del Golfo', 'San Alejo', 'Yayantique', 'Yucuaiquín',
        ],
      },
    ],
  },
];

// ─── Ejecución ───────────────────────────────────────────────────
const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.\n');

    // Limpiar tablas en orden (FK constraints)
    await Distrito.destroy({ where: {}, truncate: true, cascade: true });
    await Municipio.destroy({ where: {}, truncate: true, cascade: true });
    await Departamento.destroy({ where: {}, truncate: true, cascade: true });

    let totalDistritos = 0;

    for (const depto of data) {
      const departamento = await Departamento.create({ nombre: depto.nombre });
      console.log(`${depto.nombre}`);

      for (const muni of depto.municipios) {
        const municipio = await Municipio.create({
          nombre: muni.nombre,
          id_departamento: departamento.id,
        });

        for (const distritoNombre of muni.distritos) {
          await Distrito.create({
            nombre: distritoNombre,
            id_municipio: municipio.id,
          });
          totalDistritos++;
        }
      }
    }

    console.log(`\nSeeder completado:`);
    console.log(`   ${data.length} departamentos`);
    console.log(`   ${data.reduce((acc, d) => acc + d.municipios.length, 0)} municipios`);
    console.log(`   ${totalDistritos} distritos`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seeder:', error);
    await sequelize.close();
    process.exit(1);
  }
};

// ─── Ejecución ───────────────────────────────────────────────────
export const seedUbicaciones = async () => {
  try {
    // 1. Verificamos si ya existen datos para no duplicar ni borrar nada en cada reinicio
    const count = await Departamento.count();
    if (count > 0) {
      console.log('Datos geográficos (Ubicaciones) ya inicializados.');
      return; 
    }

    console.log('Iniciando carga de departamentos, municipios y distritos...');

    // Limpiar tablas por seguridad (solo se ejecutará la primera vez)
    await Distrito.destroy({ where: {}, truncate: true, cascade: true });
    await Municipio.destroy({ where: {}, truncate: true, cascade: true });
    await Departamento.destroy({ where: {}, truncate: true, cascade: true });

    let totalDistritos = 0;

    for (const depto of data) {
      const departamento = await Departamento.create({ nombre: depto.nombre });

      for (const muni of depto.municipios) {
        const municipio = await Municipio.create({
          nombre: muni.nombre,
          id_departamento: departamento.id,
        });

        for (const distritoNombre of muni.distritos) {
          await Distrito.create({
            nombre: distritoNombre,
            id_municipio: municipio.id,
          });
          totalDistritos++;
        }
      }
    }

    console.log(`Seeder completado: ${data.length} Deptos, ${totalDistritos} Distritos.`);
  } catch (error) {
    console.error('Error en el seeder de ubicaciones:', error);
  }
};