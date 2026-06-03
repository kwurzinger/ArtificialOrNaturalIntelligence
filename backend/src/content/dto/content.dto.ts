import { ApiProperty } from '@nestjs/swagger';

export class ContentIdsResponse {
  @ApiProperty({
    example: 1,
    description: 'Eindeutige ID eines Contents',
  })
  content_id: number;
}

export class ContentLinkResponse {
  @ApiProperty({
    example: 'http://localhost:3000/static/sampleText.txt',
    description: 'Direkter Link zum Content',
  })
  content_link: string;

  @ApiProperty({
    example: 'AI',
    description: 'Ersteller des Contents',
  })
  content_creator: string;
}

export class ContentCreateDto {  
  @ApiProperty({
    example: 1,
    description: 'Level des Contents',
  })
  content_level: number;

  @ApiProperty({
    example: 'http://localhost:3000/static/sampleText.txt',
    description: 'Direkter Link zum Content',
  })
  content_link: string;

  @ApiProperty({
    example: 'AI',
    description: 'Ersteller des Contents',
  })
  content_creator: string;

  @ApiProperty({
    example: 'Achte bei diesem Content auf die folgenden Dinge: ...',
    description: 'Unterscheidungstipps zum Content (optional)',
  })
  content_advisory_text: string;

  @ApiProperty({
    example: 1,
    description: 'Id des Contents',
  })
  content_id: number;
}