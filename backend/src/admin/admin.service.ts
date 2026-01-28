import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const count = await this.adminRepo.count();
    if (count > 0) return;

    const username = process.env.ADMIN_DEFAULT_USERNAME ?? 'admin';
    const password = process.env.ADMIN_DEFAULT_PASSWORD ?? 'password';
    const hash = await bcrypt.hash(password, 12);

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

  async changePassword(
    adminId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: true }> {
    const admin = await this.adminRepo.findOne({ where: { admin_id: adminId } });
    if (!admin) throw new NotFoundException('Admin nicht gefunden');

    const ok = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!ok) throw new UnauthorizedException('Aktuelles Passwort ist falsch');

    admin.password_hash = await bcrypt.hash(newPassword, 12);
    await this.adminRepo.save(admin);

    return { success: true };
  }
}