import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'password' })
  password: string;
}

export class AdminCreateDto {
  @ApiProperty({ example: 'max.mustermann' })
  username: string;

  @ApiProperty({ example: 'secure-password' })
  password: string;
}

export class AdminChangePasswordDto {
  @ApiProperty({ example: 'max.mustermann', description: 'Admin-User, dessen Passwort geändert werden soll' })
  username: string;

  @ApiProperty({ example: 'own-current-password', description: 'Aktuelles Passwort des eingeloggten Admins zur Autorisierung' })
  currentPassword: string;

  @ApiProperty({ example: 'new-password' })
  newPassword: string;
}

export class AdminLoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
}

export class AdminUserResponseDto {
  @ApiProperty({ example: 1 })
  admin_id: number;

  @ApiProperty({ example: 'admin' })
  username: string;
}
