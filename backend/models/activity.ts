'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface ActivityAttributes {
  id?: bigint;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  locationId: number;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  class Activity extends Model<ActivityAttributes> implements ActivityAttributes {
    public id!: bigint;
    public title!: string;
    public description!: string;
    public startTime!: Date;
    public endTime!: Date;
    public locationId!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Activity.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
    }
  }
  Activity.init({
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Activity;
};