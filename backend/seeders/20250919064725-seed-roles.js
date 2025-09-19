'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    const roles = [
      { name: 'aventurier' },
      { name: 'artisan' },
      { name: 'senechal' },
    ];

    for (const role of roles) {
      await queryInterface.sequelize.query(
        `INSERT INTO roles (name, created_at, updated_at) VALUES (?, ?, ?) ON CONFLICT (name) DO NOTHING`,
        {
          replacements: [role.name, new Date(), new Date()],
          type: Sequelize.QueryTypes.INSERT,
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
