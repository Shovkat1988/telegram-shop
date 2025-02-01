import { Uploads } from 'src/entities/uploads.entity';
import { Repository } from 'typeorm';

const findUpload = async (
  repository: Repository<Uploads>,
  id: number,
  select: string[] = ['*'],
) => {
  return await repository
    .createQueryBuilder('uploads')
    .select(select)
    .where('uploads.id = :id', { id })
    .getRawOne();
};

export { findUpload };
