'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface RoleAttributes {
  id?: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  class Role extends Model<RoleAttributes> implements RoleAttributes {
    public id!: number;
    public name!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Role;
};