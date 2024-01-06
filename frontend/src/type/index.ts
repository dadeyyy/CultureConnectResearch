export type IUpdateUser = {
  userId: number;
  firstName: string;
  lastName: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: number;
  caption: string;
  file: File[];
  province: string;
  municipal: string;
};

export type IUpdatePost = {
  postId: number;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  province: string;
  municipal: string;
};
export type IUser = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  firstName: number;
  lastName: string;
  email: string;
  username: string;
  password: string;
};
