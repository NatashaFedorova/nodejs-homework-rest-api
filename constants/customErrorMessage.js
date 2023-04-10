const customErrorMessage = {
  errorCreateUser: 'Email in use',
  errorFindingUser: 'Contact not found',
  validationUserIdError: 'Invalid user id',
  tokenError: 'Not authorized',
  errorLogin: 'Email or password is wrong',
  errValidationUserData: 'Помилка від Joi або іншої бібліотеки валідації',
  errUploadImage: 'Please upload a image',
  errorChangeAvatar: 'Something is wrong try again',
  errorVerificationToken: 'Invalid verification token',
  errVerification: 'Please verify your email',
  errFindUserByVerificationToker: 'User not found',
  errFindUserByEmail: 'User not found',
  errResendVerifyEmail: 'Verification has already been passed',
  errValidationEmailResendVerifyEmail: 'missing required field email',
};

module.exports = customErrorMessage;
