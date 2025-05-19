export type CreateUser = {
  username: string
  password: string
  team: string
}

export type User = {
  username: string
  team: string
  roles: UserRole[]
}

export type LoginCredentials = {
  username: string
  password: string
}

export enum UserRole {
  /**
   *  Basic role given when to whoever which create an account
   */
  User = 'user',
  /**
   * Admin role is allowed to connect to the admin panel
   */
  Admin = 'admin',
  /**
   * Player role is allowed to play the game. Removed for admin
   */
  Player = 'player',
  /**
   * Role manager is allowed to give and revoke roles to other users
   */
  RoleManager = 'role-manager',
  /**
   * Game master role is allowed to manage the game (open/close it, setconfig, etc.)
   */
  GameMaster = 'game-master',
  /**
   * Author role is allowed to create and edit challenges
   */
  Author = 'author',
  /**
   * Announcer role is allowed to create announcements (messages the game)
   */
  Announcer = 'announcer',
  /**
   * Moderator role is allowed to manage users (disconnect users, change their password, their teams, etc.)
   */
  Moderator = 'moderator',
  /**
   * Rewarder role is allowed to give rewards to users
   */
  Rewarder = 'rewarder',
}

export const UserRoleDescriptions: Record<UserRole, string> = {
  [UserRole.User]: ' Basic role given when to whoever which create an account',
  [UserRole.Player]:
    'Player role is allowed to play the game. Removed for admin',
  [UserRole.Admin]: 'Admin role is allowed to connect to the admin panel',
  [UserRole.RoleManager]:
    'Role manager is allowed to give and revoke roles to other users',
  [UserRole.GameMaster]:
    'Game master role is allowed to manage the game (open/close it, setconfig, etc.)',
  [UserRole.Author]: 'Author role is allowed to create and edit challenges',
  [UserRole.Announcer]:
    'Announcer role is allowed to create announcements (messages the game)',
  [UserRole.Rewarder]: 'Rewarder role is allowed to give rewards to users',
  [UserRole.Moderator]:
    'Moderator role is allowed to manage users (disconnect users, change their password, their teams, etc.)',
}
