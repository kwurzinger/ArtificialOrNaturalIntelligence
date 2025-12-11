import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async getContentIdsByLevel(level: number): Promise<Content[]> {
    return this.contentRepository.find({select: ['content_id'], where: {content_level: level}})
  }

  async getContentById(id: number): Promise<Content> {
    return this.contentRepository.findOne({select: ['content_link', 'content_creator'], where: {content_id: id}});
  }

  // addContent(createContentDto: CreateContentDto) {
  //   //Not implemented Yet
  //   return 'This action adds a new content';
  // }

  removeContentById(id: number) {
    //Not implemented Yet
    return `This action removes a #${id} content`;
  }
}