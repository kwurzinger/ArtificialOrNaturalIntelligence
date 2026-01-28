import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminChangePasswordDto, AdminLoginDto, AdminLoginResponseDto } from './dto/admin.dto';
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

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin Passwort ändern' })
  @ApiOkResponse({ description: 'Passwort geändert', type: SuccessResponseDto })
  @ApiUnauthorizedResponse({ description: 'Kein/ungültiger Token oder aktuelles Passwort falsch' })
  @ApiBody({ type: AdminChangePasswordDto })
  async changePassword(@Req() req: any, @Body() dto: AdminChangePasswordDto): Promise<SuccessResponseDto> {
    return this.adminService.changePassword(req.user.adminId, dto.currentPassword, dto.newPassword);
  }
}