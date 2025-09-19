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
      await queryInterface.upsert('roles', {
        ...role,
        created_at: new Date(),
        updated_at: new Date(),
      }, {
        name: role.name,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
