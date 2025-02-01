import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailingQueue } from 'src/entities/mailing-queue.entity';
import { Uploads } from 'src/entities/uploads.entity';
import { Repository } from 'typeorm';
import { AdminMailingBody } from './dto/mailing-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import validateImage from 'src/utils/validateImage.utils';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';

@Injectable()
export class MailingService {
  constructor(
    @InjectRepository(MailingQueue)
    private readonly mailingQueueRepository: Repository<MailingQueue>,

    @InjectRepository(Uploads)
    private readonly uploadsRepository: Repository<Uploads>,
  ) {}

  async sendMailing(body: AdminMailingBody): Promise<CreateDataDto> {
    if (!body.text && !body.image_id) errorGenerator(Errors.BAD_REQUEST);

    if (body.image_id)
      await validateImage(this.uploadsRepository, body.image_id);

    const insertAction = await this.mailingQueueRepository
      .createQueryBuilder()
      .insert()
      .into(MailingQueue)
      .values({
        text: body.text ? body.text : null,
        image_id: body.image_id ? body.image_id : null,
        created_at: getCurrentTimestamp(),
      })
      .execute();

    return {
      id: insertAction.identifiers[0].id,
    };
  }
}
