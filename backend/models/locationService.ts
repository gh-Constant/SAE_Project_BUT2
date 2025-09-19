'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface LocationServiceAttributes {
  id?: bigint;
  locationId: number;
  serviceId: number;
  isActive?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  class LocationService extends Model<LocationServiceAttributes> implements LocationServiceAttributes {
    public id!: bigint;
    public locationId!: number;
    public serviceId!: number;
    public isActive!: boolean;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      LocationService.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
      LocationService.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
    }
  }
  LocationService.init({
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'LocationService',
    tableName: 'locationServices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return LocationService;
};