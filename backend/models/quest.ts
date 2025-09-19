'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface QuestAttributes {
  id?: bigint;
  title: string;
  description: string;
  xpReward?: number;
  locationId: number;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  class Quest extends Model<QuestAttributes> implements QuestAttributes {
    public id!: bigint;
    public title!: string;
    public description!: string;
    public xpReward!: number;
    public locationId!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Quest.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
      Quest.hasMany(models.UserQuest, { foreignKey: 'questId', as: 'userQuests' });
    }
  }
  Quest.init({
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    xpReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Quest',
    tableName: 'quests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Quest;
};