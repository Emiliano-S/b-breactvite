export const UserModel = {
  uid: '',
  email: '',
  displayName: '',
  role: 'guest', // 'admin' | 'guest'
  phone: '',
  createdAt: null,
  updatedAt: null
};

export const createUser = (data) => ({
  ...UserModel,
  ...data,
  createdAt: new Date(),
  updatedAt: new Date()
});