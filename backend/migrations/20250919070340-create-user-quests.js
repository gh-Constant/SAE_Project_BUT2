'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('userQuests', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      questId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'quests',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'accepted',
        validate: {
          isIn: [['accepted', 'completed']],
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Add unique constraint
    await queryInterface.addIndex('userQuests', ['userId', 'questId'], {
      unique: true,
      name: 'unique_user_quest',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('userQuests');
  }
};
