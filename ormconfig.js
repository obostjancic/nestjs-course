module.exports = {
  type: 'postgres', // type of our database
  host: 'localhost', // database host
  port: 5432, // database host
  username: '', // username
  password: 'pass123', // user password
  database: 'postgres', // name of our database,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
