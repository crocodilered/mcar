class FirebaseErrors {
  static getMessage (errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Пользователь не обнаружен.'
      case 'auth/wrong-password':
        return 'Введен неверный пароль.'
      case 'auth/too-many-requests':
        return 'Перебор с неудачными попытками входа, попробуйте еще раз через пару минут.'
      case 'auth/email-already-in-use':
        return 'Пользователь с этим адресом уже зарегистрирован.'
      default:
        return `Произошла ошибка (${errorCode}).`
    }
  }
}

export default FirebaseErrors
