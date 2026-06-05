import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  AdminChangePasswordDto,
  AdminCreateDto,
  AdminLoginDto,
  AdminLoginResponseDto,
  AdminUserResponseDto,
} from './dto/admin.dto';
import { SuccessResponseDto } from '../dto/success-response.dto';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin Login (JWT Token erhalten)' })
  @ApiOkResponse({ description: 'Login erfolgreich', type: AdminLoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Username/Passwort falsch' })
  @ApiBody({ type: AdminLoginDto })
  async login(@Body() dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    return this.adminService.login(dto.username, dto.password);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alle Admin-User auflisten' })
  @ApiOkResponse({ description: 'Admin-User aufgelistet', type: [AdminUserResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Kein/ungültiger Token' })
  async getAdmins(): Promise<AdminUserResponseDto[]> {
    return this.adminService.getAdmins();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin-User anlegen' })
  @ApiCreatedResponse({ description: 'Admin-User angelegt', type: AdminUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Kein/ungültiger Token' })
  @ApiConflictResponse({ description: 'Admin-User existiert bereits' })
  @ApiBadRequestResponse({ description: 'Username oder Passwort fehlt' })
  @ApiBody({ type: AdminCreateDto })
  async createAdmin(@Body() dto: AdminCreateDto): Promise<AdminUserResponseDto> {
    return this.adminService.createAdmin(dto.username, dto.password);
  }

  @Delete(':username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin-User löschen' })
  @ApiParam({ name: 'username', example: 'max.mustermann' })
  @ApiOkResponse({ description: 'Admin-User gelöscht', type: SuccessResponseDto })
  @ApiUnauthorizedResponse({ description: 'Kein/ungültiger Token' })
  @ApiNotFoundResponse({ description: 'Admin nicht gefunden' })
  @ApiBadRequestResponse({ description: 'Rootadmin "admin" darf nicht gelöscht werden' })
  async deleteAdmin(@Param('username') username: string): Promise<SuccessResponseDto> {
    return this.adminService.deleteAdmin(username);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin-Passwort für einen bestimmten Admin-User ändern' })
  @ApiOkResponse({ description: 'Passwort geändert', type: SuccessResponseDto })
  @ApiUnauthorizedResponse({ description: 'Kein/ungültiger Token oder aktuelles Passwort falsch' })
  @ApiNotFoundResponse({ description: 'Admin nicht gefunden' })
  @ApiBody({ type: AdminChangePasswordDto })
  async changePassword(@Body() dto: AdminChangePasswordDto): Promise<SuccessResponseDto> {
    return this.adminService.changePassword(
      dto.username,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
