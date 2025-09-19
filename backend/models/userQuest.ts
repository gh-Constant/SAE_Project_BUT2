'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface UserQuestAttributes {
  id?: bigint;
  userId: string;
  questId: bigint;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  class UserQuest extends Model<UserQuestAttributes> implements UserQuestAttributes {
    public id!: bigint;
    public userId!: string;
    public questId!: bigint;
    public status!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      UserQuest.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      UserQuest.belongsTo(models.Quest, { foreignKey: 'questId', as: 'quest' });
    }
  }
  UserQuest.init({
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    questId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'accepted',
      validate: {
        isIn: [['accepted', 'completed']],
      },
    },
  }, {
    sequelize,
    modelName: 'UserQuest',
    tableName: 'userQuests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return UserQuest;
};