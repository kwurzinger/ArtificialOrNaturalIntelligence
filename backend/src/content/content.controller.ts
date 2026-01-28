import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, NotFoundException, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContentCreateDto, ContentIdsResponse, ContentLinkResponse } from './dto/content.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponseDto } from '../dto/success-response.dto';
import { JwtAuthGuard } from 'src/admin/jwt-auth.guard';

@Controller('content')
@ApiTags('Content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get("/level/:level")
  @ApiOperation({ summary: 'Liefert eine Liste aller ContentIds für ein bestimmtes Level' })
  @ApiOkResponse({
    description: 'Erfolgreiche Antwort',
    type: ContentIdsResponse,
    isArray: true
  })
  async getContentIdsByLevel(@Param('level', ParseIntPipe) level: number): Promise<Content[]> {
    const contentIds = await this.contentService.getContentIdsByLevel(level);

    if (contentIds.length == 0){
      throw new NotFoundException("Für dieses Level gibt es keine Inhalte!");
    }

    return contentIds;
  }

  @Get(":id")
  @ApiOperation({ summary: 'Liefert den Link zum gewünschten Content anhand der ContentId' })
  @ApiOkResponse({
    description: 'Erfolgreiche Antwort',
    type: ContentLinkResponse
  })
  async getContentById(@Param('id', ParseIntPipe) id: number): Promise<Content> {
    const content = await this.contentService.getContentById(id);

    if (!content) {
      throw new NotFoundException("Ein Inhalt mit dieser ID existiert nicht!");
    }

    return content;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Content hochladen' })
  @ApiOkResponse({
    description: 'Erfolgreiche Antwort',
    type: ContentCreateDto
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content_level: { type: 'integer' },
        content_creator: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['content_level', 'content_creator', 'file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async addContent(
    @Body() createContentDto: ContentCreateDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Content> {
    return this.contentService.addContent(createContentDto, file);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Content anhand der ID löschen' })
  @ApiOkResponse({
    description: 'Erfolgreiche Antwort',
    type: SuccessResponseDto
  })
  async removeContentById(@Param('id', ParseIntPipe) id: number): Promise<{ success: true }> {
    const result = await this.contentService.removeContentById(id);

    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException("Ein Inhalt mit dieser ID existiert nicht!");
    }

    return { success: true};
  }
}