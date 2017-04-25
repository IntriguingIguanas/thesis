exports.up = function(knex, Promise) { //CHAIN PROMISES
  // create table schemas here
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
  }).then(() => {
    return knex.schema.createTable('boards', (table) => {
      table.increments();
      table.string('boardname').notNullable();
      table.timestamp('timestamp').defaultTo(knex.fn.now());
      table.integer('current_order')
    });
  }).then(() => {
    return knex.schema.createTable('users_boards', (table) => {
      table.increments();
      table.integer('user_id');
      table.integer('board_id');
      table.string('access');
      table.boolean('starred');
    });
  }).then(() => {
    return knex.schema.createTable('lists', (table) => {
      table.increments();
      table.integer('board_id').notNullable();
      table.string('listname').notNullable();
      table.integer('list_order')
    })
  }).then(() => {
    return knex.schema.createTable('tasks', (table) => {
      table.increments();
      table.integer('list_id').notNullable();
      table.string('text').notNullable();
      table.integer('assigned')
      table.integer('task_order').notNullable();
    })
  }).then(() =>> {
    return knex.schema.createTable('session', (table) => {
      table.increments();
      table.string(sid).notNullable();
      table.json(sess).notNullable();
      table.timestamp('timestamp').defaultTo(knex.fn.now());
    })
  })
};

exports.down = function(knex, Promise) {
	// drop table schemas here
  return knex.schema.dropTable('users')
  .then(() => {
    return knex.schema.dropTable('boards');
  }).then(() => {
    return knex.schema.dropTable('users_boards');
  }).then(() => {
    return knex.schema.dropTable('lists');
  }).then(() => {
    return knex.schema.dropTable('tasks');
  });
};
