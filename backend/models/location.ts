'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface LocationAttributes {
  id?: number;
  staticCode: string;
  price?: number;
  available?: boolean;
  userId?: string;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  class Location extends Model<LocationAttributes> implements LocationAttributes {
    public id!: number;
    public staticCode!: string;
    public price!: number;
    public available!: boolean;
    public userId!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Location.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
      Location.hasMany(models.LocationService, { foreignKey: 'locationId', as: 'services' });
      Location.hasMany(models.Product, { foreignKey: 'locationId', as: 'products' });
      Location.hasMany(models.Quest, { foreignKey: 'locationId', as: 'quests' });
      Location.hasMany(models.Activity, { foreignKey: 'locationId', as: 'activities' });
    }
  }
  Location.init({
    staticCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Location',
    tableName: 'locations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Location;
};