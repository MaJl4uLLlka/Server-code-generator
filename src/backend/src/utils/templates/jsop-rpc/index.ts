import { Prisma } from '@prisma/client';

interface Config {
  apiPrefix?: string;
  port: number;
  dbConnectionUri: string;
}

export function buildTemplate(repository: any): string {
  let templateString = '';
  templateString += buildConstants(repository.config);
  templateString += buildDatabaseConfig(repository.config);
  templateString += buildIndex();
  templateString += buildApp(repository.config);
  templateString += buildEntities(repository.entities);
  templateString += buildServices(repository.services);

  return templateString;
}

function buildConstants(config: Config): string {
  let apiPrefix;
  if (config.apiPrefix && config.apiPrefix.length !== 0) {
    apiPrefix = "'" + config.apiPrefix + "'";
  } else {
    apiPrefix = null;
  }
  const constantTemplates = `
  @@constants/index.js;\n
  const apiPrefix = ${apiPrefix};

  module.exports = {
      apiPrefix
  };`;

  return constantTemplates;
}

function buildDatabaseConfig(config: Config) {
  const template = `
  @@db/index.js;\n
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize('${config.dbConnectionUri}');

  async function connectToDBAndSync() {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await sequelize.sync({ force: true });
      console.log("All models were synchronized successfully.");
  }

  module.exports = {
      sequelize,
      connectToDBAndSync
  }
  `;

  return template;
}

function buildIndex() {
  const template = `
  @@index.js;\n
  const { initApp } = require('./app');
  const { connectToDBAndSync } = require('./db');

  (async () => {
      await connectToDBAndSync();
      initApp();
  })();
  `;

  return template;
}

function buildApp(config: Config) {
  const template = `
  @@app.js;\n
  const express = require('express');
  const app = express();
  const { apiPrefix } = require('./constants');
  const { JSONRPCServer } = require("json-rpc-2.0");
  const bodyParser = require('body-parser');
  const server = new JSONRPCServer();

  server.addMethod("echo", ({ text }) => text);
  server.addMethod("log", ({ message }) => console.log(message));

  function handleRPC(req, res) {
    const jsonRPCRequest = req.body;
    // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
    // It can also receive an array of requests, in which case it may return an array of responses.
    // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
      if (jsonRPCResponse) {
        res.json(jsonRPCResponse);
      } else {
        // If response is absent, it was a JSON-RPC notification method.
        // Respond with no content status (204).
        res.sendStatus(204);
      }
    });
  }
  
  module.exports = {
      initApp: () => {
          app.use(bodyParser.urlencoded({ extended: false }));
          app.use(bodyParser.json());
  
          if (apiPrefix && apiPrefix.length !=0) {
              app.post(apiPrefix, handleRPC);
          }
          else {
              app.post('/json-rpc', handleRPC);
          }

          app.listen(${config.port}, () => console.log('App starting at http://localhost:${config.port}'));
      },
      express,
      app,
  };
  `;

  return template;
}

function buildEntities(entities: any[]) {
  let template = ``;
  const entitiesInfo: { modelName: string; entityName: string }[] = [];

  for (const entity of entities) {
    const path = `entities/${entity.name}.js`;
    const entityModelName = entity.name + 'Model';
    entitiesInfo.push({ modelName: entityModelName, entityName: entity.name });
    let entityTemplate = `
    @@${path};\n
    const { sequelize }  = require('../db');
    const { DataTypes } = require('sequelize');
    
    const ${entityModelName} = sequelize.define(
      '${entityModelName}',
      {
    `;
    const columns = JSON.parse(entity.schema);

    for (const column of columns) {
      entityTemplate += `
      ${column.name}: {
        type: DataTypes.${column.type},
        ${column.isPrimaryKey ? 'primaryKey: true,' : ''}
        ${column.isNull ? 'allowNull: true,' : ''}
      },
      `;
    }
    entityTemplate += `
      },
      {
          tableName: '${entityModelName}',
      }
    );`;

    entityTemplate += `${entityModelName}.makeRelations = (sequelizeInst) => {`;
    for (const link of entity.fromLinks) {
      if (link.linkType === 'OneToOne') {
        entityTemplate += `
        sequelizeInst.models.${entityModelName}.hasOne(sequelizeInst.models.${
          link.toEntity.name + 'Model'
        });`;
      } else if (link.linkType === 'OneToMany') {
        entityTemplate += `
        sequelizeInst.models.${entityModelName}.hasMany(sequelizeInst.models.${
          link.toEntity.name + 'Model'
        });`;
      } else if (link.linkType === 'ManyToMany') {
        entityTemplate += `
        sequelizeInst.models.${entityModelName}.belongsToMany(sequelizeInst.models.${
          link.toEntity.name + 'Model'
        },
        { through: '${link.fromEntity.name}_${link.toEntity.name}' });`;
      }
    }

    for (const link of entity.toLinks) {
      if (link.linkType === 'OneToOne') {
        entityTemplate += `
        sequelizeInst.models.${entityModelName}.belongsTo(sequelizeInst.models.${
          link.fromEntity.name + 'Model'
        });`;
      } else if (link.linkType === 'OneToMany') {
        entityTemplate += `
        sequelizeInst.models.${entityModelName}.belongsTo(sequelizeInst.models.${
          link.fromEntity.name + 'Model'
        });`;
      } else if (link.linkType === 'ManyToMany') {
        entityTemplate += `
        sequelizeInst.models.${entityModelName}.belongsToMany(sequelizeInst.models.${
          link.fromEntity.name + 'Model'
        },
        { through: '${link.fromEntity.name}_${link.toEntity.name}' });`;
      }
    }
    entityTemplate += `};

    module.exports = {
        ${entityModelName}
    }`;

    template += entityTemplate;
  }

  template += `
  @@entities/index.js;\n
  const { sequelize } = require('../db');
  `;

  for (const entityInfo of entitiesInfo) {
    template += `const { ${entityInfo.modelName} } = require('./${entityInfo.entityName}');
    `;
  }

  template += `
  for (const key in sequelize.models) {
    const model = sequelize.models[key];
    if (model.hasOwnProperty('makeRelations')) {
        model.makeRelations(sequelize);
    }
  }`;

  template += `module.exports = {
    ${entitiesInfo.map((entityInfo) => entityInfo.modelName).join(',\n')}
  };
  `;

  return template;
}

function buildServices(services: any[]) {
  let template = ``;

  const servicesNames: string[] = [];

  for (const service of services) {
    const relatedEntityName = service.entity.name + 'Model';
    const variableName =
      relatedEntityName[0] +
      relatedEntityName.substring(1, relatedEntityName.length - 1);
    const serviceTemplate = `
    @@services/${service.name}Service.js;\n
    const { ${relatedEntityName} } = require('../entities');

    async function create(data) {
        return await ${relatedEntityName}.create(data);
    }
    
    async function getAll() {
        return await ${relatedEntityName}.findAll();
    }
    
    async function getById(id) {
        return await ${relatedEntityName}.findByPk(id);
    }
    
    async function update(id, data) {
        const ${variableName} = await getById(id);
    
        if (${variableName}) {
            return await ${variableName}.update(data);
        }
    
        return 0;
    }
    
    async function drop(id) {
        const ${variableName} = await getById(id);
    
        if (${variableName}) {
            return await ${variableName}.destroy(data);
        }
    
        return 0;
    }
    
    module.exports = {
        create,
        getAll,
        getById,
        update,
        drop
    };
    `;

    servicesNames.push(service.name + 'Service');
    template += serviceTemplate;
  }

  const servicesImports = servicesNames.map(
    (name) => `const ${name} = require('./${name}');`,
  );
  template += `
  @@services/index.js;\n
  ${servicesImports.join('\n')}

  module.exports = {
      ${servicesNames.join(',')}
  }
  `;

  return template;
}
