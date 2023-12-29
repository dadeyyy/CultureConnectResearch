export type IUpdateUser = {
  userId: string;
  firstName: string;
  lastName: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  province: string;
  municipal: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  province: string;
  municipal: string;
};
export type IUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};
