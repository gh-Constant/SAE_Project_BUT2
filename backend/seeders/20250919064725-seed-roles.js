'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'aventurier',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'artisan',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'senechal',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
