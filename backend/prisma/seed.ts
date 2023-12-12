import { db } from '../src/utils/db.server';

enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

type User = {
  username: string;
  password: string;
  email: string;
  firstName: string
  lastName: string
  role: UserRole;
  bio?: string;
  avatarUrl?: string;
};

type Post = {
  caption: string;
  province: string;
  municipality: string;
  photos: string[];
};

function getUser(): Array<User> {
  return [
    {
      username: 'JohnDoe',
      password: 'TestPassword',
      email: 'JohnDoe@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ADMIN,
    },
  ];
}

function getPost(): Array<Post> {
  return [
    {
      caption: 'Caption 1',
      province: 'Bataan',
      municipality: 'Balanga',
      photos: ['image1.com', 'image2.com'],
    },

    {
      caption: 'Caption 2',
      province: 'Bataan',
      municipality: 'Orion',
      photos: ['photos1.com', 'photos2.com'],
    },
  ];
}

async function seed() {
  await Promise.all(
    getUser().map((user) => {
      return db.user.create({
        data: {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          role: user.role,
        },
      });
    })

  );

  const user = await db.user.findFirst({
    where:{
        username: 'JohnDoe'
    }
  })

  await Promise.all(
    getPost().map((post)=>{
        return db.post.create({
            data: {
                caption: post.caption,
                municipality: post.municipality,
                province: post.province,
                photos: {set : post.photos},
                user: {
                    connect:{
                        id: user?.id
                    }
                }
            }
        })
    })
  )
}

seed()