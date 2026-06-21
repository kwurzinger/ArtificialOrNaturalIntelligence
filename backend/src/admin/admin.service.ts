import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';

let ROOT_ADMIN_USERNAME: string = 'admin';
const BCRYPT_ROUNDS: number = 12;

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const count = await this.adminRepo.count();
    if (count > 0) return;

    //Default admin user anlegen, wenn noch kein Admin existiert
    const username = process.env.ADMIN_DEFAULT_USERNAME ?? ROOT_ADMIN_USERNAME;
    ROOT_ADMIN_USERNAME = username; // Setze den Root-Admin-Benutzernamen auf den Standardwert oder den aus der Umgebungsvariable

    const password = process.env.ADMIN_DEFAULT_PASSWORD ?? 'password';
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await this.adminRepo.save({ username, password_hash: hash });
  }

  async login(username: string, password: string): Promise<{ access_token: string }> {
    const admin = await this.adminRepo.findOne({ where: { username } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const access_token = await this.jwtService.signAsync({
      sub: admin.admin_id,
      username: admin.username,
    });

    return { access_token };
  }

  async getAdmins(): Promise<{ admin_id: number; username: string }[]> {
    const admins = await this.adminRepo.find({
      select: {
        admin_id: true,
        username: true,
      },
      order: {
        username: 'ASC',
      },
    });

    return admins.map((admin) => ({
      admin_id: admin.admin_id,
      username: admin.username,
    }));
  }

  async createAdmin(username: string, password: string): Promise<{ admin_id: number; username: string }> {
    const normalizedUsername = username?.trim();
    if (!normalizedUsername) throw new BadRequestException('Username darf nicht leer sein');
    if (!password) throw new BadRequestException('Passwort darf nicht leer sein');

    const existing = await this.adminRepo.findOne({ where: { username: normalizedUsername } });
    if (existing) throw new ConflictException('Admin-User existiert bereits');

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const admin = await this.adminRepo.save({ username: normalizedUsername, password_hash });

    return { admin_id: admin.admin_id, username: admin.username };
  }

  async deleteAdmin(username: string): Promise<{ success: true }> {
    const normalizedUsername = username?.trim();
    if (!normalizedUsername) throw new BadRequestException('Username darf nicht leer sein');

    if (normalizedUsername === ROOT_ADMIN_USERNAME) {
      throw new BadRequestException(`Der Rootadmin "${ROOT_ADMIN_USERNAME}" darf nicht gelöscht werden`);
    }

    const admin = await this.adminRepo.findOne({ where: { username: normalizedUsername } });
    if (!admin) throw new NotFoundException('Admin nicht gefunden');

    await this.adminRepo.remove(admin);
    return { success: true };
  }

  async changePassword(
    username: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: true }> {
    const normalizedUsername = username?.trim();
    if (!normalizedUsername) throw new BadRequestException('Username darf nicht leer sein');
    if (!newPassword) throw new BadRequestException('Neues Passwort darf nicht leer sein');

    const targetAdmin = await this.adminRepo.findOne({ where: { username: normalizedUsername } });
    if (!targetAdmin) throw new NotFoundException('Admin nicht gefunden');

    const currentPasswordOk = await bcrypt.compare(currentPassword, targetAdmin.password_hash);
    if (!currentPasswordOk) throw new UnauthorizedException('Aktuelles Passwort ist falsch');

    targetAdmin.password_hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.adminRepo.save(targetAdmin);

    return { success: true };
  }
}
