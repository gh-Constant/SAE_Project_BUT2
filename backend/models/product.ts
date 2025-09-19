'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface ProductAttributes {
  id?: bigint;
  name: string;
  description: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  locationId: number;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  class Product extends Model<ProductAttributes> implements ProductAttributes {
    public id!: bigint;
    public name!: string;
    public description!: string;
    public price!: number;
    public stock!: number;
    public imageUrl!: string;
    public locationId!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Product.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Product;
};