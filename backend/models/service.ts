'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface ServiceAttributes {
  id?: number;
  serviceCode: string;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  class Service extends Model<ServiceAttributes> implements ServiceAttributes {
    public id!: number;
    public serviceCode!: string;
    public name!: string;
    public description!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Service.hasMany(models.LocationService, { foreignKey: 'serviceId', as: 'locationServices' });
    }
  }
  Service.init({
    serviceCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Service',
    tableName: 'services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Service;
};