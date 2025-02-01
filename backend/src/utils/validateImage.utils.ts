import { Uploads } from 'src/entities/uploads.entity';
import Errors from 'src/errors.enum';
import { findUpload } from 'src/queries/uploads.queries';
import { Repository } from 'typeorm';
import errorGenerator from './errorGenerator.utils';

interface Response {
  url: string;
  id: number;
}

const validateImage = async (
  repository: Repository<Uploads>,
  image_id: number,
): Promise<Response> => {
  const findImage = await findUpload(repository, image_id, ['*']);

  if (findImage) {
    return {
      url: findImage.url,
      id: findImage.id,
    };
  } else {
    errorGenerator(Errors.PHOTO_NOT_FOUND);
  }
};

export default validateImage;
