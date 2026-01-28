import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { ContentCreateDto } from './dto/content.dto';
import { APP_CONFIG, AppConfig } from '../app-config/app-config.constants';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: Repository<Content>,
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig,
  ) {}

  async getContentIdsByLevel(level: number): Promise<Content[]> {
    return this.contentRepository.find({select: ['content_id'], where: {content_level: level}})
  }

  async getContentById(id: number): Promise<Content> {
    return this.contentRepository.findOne({select: ['content_link', 'content_creator'], where: {content_id: id}});
  }

  async removeFile(filename: string) {
    if (filename) {
      try {
        await unlink(join(this.appConfig.staticDir, filename));
      } catch (error) {
        console.error(error)
      }
    }
  }

  async addContent(dto: ContentCreateDto, file: Express.Multer.File): Promise<Content> {
    if (!file?.filename) throw new BadRequestException("Upload fehlgeschlagen!");

    const baseURL = this.appConfig.baseURL
    const port = this.appConfig.port
    const staticEndpoint = this.appConfig.staticEndpoint

    dto.content_level = Number(dto.content_level);

    // Falls die Anfrage aufgrund von ungültigen Parametern abgelehnt wird,
    // muss die zuvor bereits abgelegte Datei wieder entfernt werden
    if (dto.content_level < 1){
      this.removeFile(file.filename);
      throw new BadRequestException("Ungültiges Level! (muss mind. 1 sein)");
    }

    if (dto.content_creator != "AI" && dto.content_creator != "Human") {
      this.removeFile(file.filename);
      throw new BadRequestException("Ungültiger Creator! (Entweder AI oder Human)");
    }

    dto.content_link = `${baseURL}:${port}${staticEndpoint}/${file.filename}`;
    return this.contentRepository.save(dto);
  }

  async removeContentById(id: number): Promise<DeleteResult> {
    const content = await this.contentRepository.findOne({
      where: { content_id: id },
      select: ['content_id', 'content_link'],
    });

    if (!content) throw new NotFoundException('Ein Inhalt mit dieser ID existiert nicht!');

    const filename = content.content_link.substring(content.content_link.lastIndexOf('/'));
   
    await this.removeFile(filename);

    return this.contentRepository.delete({ content_id: id });
  }
}