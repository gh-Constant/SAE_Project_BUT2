'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface UserAttributes {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password_hashed: string;
  roleId: number;
  is_active?: boolean;
  is_verified?: boolean;
  xp?: bigint;
  level?: bigint;
  created_at?: Date;
  updated_at?: Date;
}

export default (sequelize: Sequelize) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    public id!: string;
    public firstname!: string;
    public lastname!: string;
    public email!: string;
    public password_hashed!: string;
    public roleId!: number;
    public is_active!: boolean;
    public is_verified!: boolean;
    public xp!: bigint;
    public level!: bigint;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
      User.hasMany(models.Location, { foreignKey: 'userId', as: 'locations' });
      User.hasMany(models.UserQuest, { foreignKey: 'userId', as: 'userQuests' });
    }
  }
  User.init({
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hashed: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    xp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return User;
};