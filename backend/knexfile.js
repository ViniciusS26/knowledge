// Update with your config settings.

module.exports = {
    client: 'pg',
    connection: {
      host:   '127.0.0.1',
      port:     '5433',
      database: 'knowledge',
      user:     'postgres',
      password: 'root',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }

};
