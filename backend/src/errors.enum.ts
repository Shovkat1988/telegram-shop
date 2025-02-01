class Errors {
  static readonly ACCESS_DENIED = {
    errorCode: 0,
    message: 'access denied',
    ru_message: 'Доступ запрещен',
  };

  static readonly NOT_FOUND = {
    errorCode: 1,
    message: 'not found',
    ru_message: 'Не найдено',
  };

  static readonly ALREADY_EXISTS = {
    errorCode: 2,
    message: 'already exists',
    ru_message: 'Уже существует',
  };

  static readonly USER_NOT_FOUND = {
    errorCode: 3,
    message: 'user not found',
    ru_message: 'Пользователь не найден',
  };

  static readonly BAD_REQUEST = {
    errorCode: 4,
    message: 'bad request',
    ru_message: 'Неверный запрос',
  };

  static readonly PHOTO_NOT_FOUND = {
    errorCode: 5,
    message: 'photo not found',
    ru_message: 'Фото не найдено',
  };

  static readonly ALREADY_ADMIN = {
    errorCode: 6,
    message: 'already admin',
    ru_message: 'Уже админ',
  };

  static readonly ONLY_IMAGES_ARE_ALLOWED = {
    errorCode: 7,
    message: 'only images are allowed',
    ru_message: 'Разрешены только изображения',
  };

  static readonly BANNED = {
    errorCode: 8,
    message: 'banned',
    ru_message: 'Забанен',
  };

  static readonly ALREADY_BANNED = {
    errorCode: 9,
    message: 'already banned',
    ru_message: 'Уже забанен',
  };

  static readonly ALREADY_UNBANNED = {
    errorCode: 10,
    message: 'already unbanned',
    ru_message: 'Уже разбанен',
  };

  static readonly MIN_ORDER_PRICE_NOT_REACHED = {
    errorCode: 11,
    message: 'min order price not reached',
    ru_message: 'Минимальная цена заказа не достигнута',
  };

  static readonly PROMOCODE_NOT_FOUND = {
    errorCode: 12,
    message: 'promocode not found',
    ru_message: 'Промокод не найден',
  };

  static readonly ALREADY_ACTIVATED = {
    errorCode: 13,
    message: 'already activated',
    ru_message: 'Уже активирован',
  };
}

export default Errors;
