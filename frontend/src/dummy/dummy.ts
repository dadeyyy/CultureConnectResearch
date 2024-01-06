// dummy.ts
const getPostsByUserId = (userId: string): DummyPost[] => {
  const userPosts = dummyPosts.filter((post) => post.creator.id === userId);

  return userPosts;
};

export type DummyUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  birthdate?: string;
  email: string;
  imageUrl: string;
  bio: string;
  posts: DummyPost[];
};

export type DummyPost = {
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl?: string | undefined;
  };
  $id: string;
  $createdAt: string;
  province: string;
  municipal: string;
  caption: string;
  imageUrl?: string | undefined;
};

export const dummyPosts: DummyPost[] = [
  {
    creator: {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      imageUrl: "/dummy/john-doe.jpg",
    },
    $id: "1234532162",
    $createdAt: "2023-01-01T12:00:00Z",
    province: "Bulacan",
    municipal: "Malolos",
    caption: "Exploring the charming streets of Malolos, Bulacan.",
    imageUrl: "/dummy/bulacan.jpg",
  },
  {
    creator: {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      imageUrl: "/dummy/john-doe.jpg",
    },
    $id: "123453216",
    $createdAt: "2023-01-01T12:00:00Z",
    province: "Bulacan",
    municipal: "Malolos",
    caption: "Exploring the charming streets of Malolos, Bulacan.",
    imageUrl: "/dummy/bulacan.jpg",
  },
  {
    creator: {
      id: "2",
      firstName: "Jane",
      lastName: "Doe",
      imageUrl: "/dummy/jane-doe.jpg",
    },
    $id: "12345314316123",
    $createdAt: "2023-01-01T12:00:00Z",
    province: "Pampanga",
    municipal: "San Fernando",
    caption: "Enjoying the vibrant culture of San Fernando, Pampanga.",
    imageUrl: "/dummy/pampanga.jpg",
  },
  {
    creator: {
      id: "3",
      firstName: "Bob",
      lastName: "Johnson",
      imageUrl: "/dummy/bob-johnson.jpg",
    },
    $id: "123445545634534",
    $createdAt: "2023-01-01T12:00:00Z",
    province: "Quezon",
    municipal: "Lucena",
    caption: "Discovering the natural beauty of Lucena, Quezon.",
    imageUrl: "/dummy/quezon.jpg",
  },
  {
    creator: {
      id: "4",
      firstName: "Alice",
      lastName: "Smith",
      imageUrl: "/dummy/alice-smith.jpg",
    },
    $id: "1234598986",
    $createdAt: "2023-01-01T12:00:00Z",
    province: "Laguna",
    municipal: "Santa Rosa",
    caption: "Relaxing by the lakeside in Santa Rosa, Laguna.",
    imageUrl: "/dummy/laguna.jpg",
  },
  {
    creator: {
      id: "5",
      firstName: "Abet",
      lastName: "Garcia",
      imageUrl: "/dummy/abet-garcia.jpg",
    },
    $id: "123dsa4598986",
    $createdAt: "2023-01-01T12:00:00Z",
    province: "Bataan",
    municipal: "Balanga",
    caption: "Baka balanga yan",
    imageUrl: "/dummy/balanga.jpg",
  },
];

export const dummyUser: DummyUser[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "john.doe",
    birthdate: "01-01-2001",
    email: "john@example.com",
    imageUrl: "/dummy/john-doe.jpg",
    bio: "Some bio text for John Doe",
    posts: getPostsByUserId("1"), // Added posts for John Doe
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Doe",
    username: "jane.doe",
    birthdate: "01-01-2001",
    email: "jane@example.com",
    imageUrl: "/dummy/jane-doe.jpg",
    bio: "Some bio text for Jane Doe",
    posts: getPostsByUserId("2"), // Added posts for Jane Doe
  },
  {
    id: "3",
    firstName: "Bob",
    lastName: "Johnson",
    username: "bob.johnson",
    birthdate: "01-01-2001",
    email: "bob@example.com",
    imageUrl: "/dummy/bob-johnson.jpg",
    bio: "Some bio text for Bob Johnson",
    posts: getPostsByUserId("3"), // Added posts for Bob Johnson
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Smith",
    username: "alice.smith",
    birthdate: "01-01-2001",
    email: "alice@example.com",
    imageUrl: "/dummy/alice-smith.jpg",
    bio: "Some bio text for Alice Smith",
    posts: getPostsByUserId("4"), // Added posts for Alice Smith
  },
  {
    id: "5",
    firstName: "Abet",
    lastName: "Garcia",
    username: "abet.garcia",
    birthdate: "01-01-2001",
    email: "abet@example.com",
    imageUrl: "/dummy/abet-garcia.jpg",
    bio: "Some bio text for Abet Garcia",
    posts: getPostsByUserId("5"), // Added posts for Abet Garcia
  },
  {
    id: "999",
    firstName: "Boss",
    lastName: "Amo",
    username: "boss.amo999",
    birthdate: "01-01-2001",
    email: "boss@example.com",
    imageUrl:
      "https://th.bing.com/th/id/OIP.FKf7M863jluP9y3oejEgpgHaHd?w=512&h=516&rs=1&pid=ImgDetMain",
    bio: "This is a test bio.",
    posts: getPostsByUserId("999"), // Added empty posts array for Boss Amo
  },
];

export const provinces = [
  "Abra",
  "Agusan del Norte",
  "Agusan del Sur",
  "Aklan",
  "Albay",
  "Antique",
  "Apayao",
  "Aurora",
  "Basilan",
  "Bataan",
  "Batanes",
  "Batangas",
  "Benguet",
  "Biliran",
  "Bohol",
  "Bukidnon",
  "Bulacan",
  "Cagayan",
  "Camarines Norte",
  "Camarines Sur",
  "Camiguin",
  "Capiz",
  "Catanduanes",
  "Cavite",
  "Cebu",
  "Compostela Valley",
  "Cotabato",
  "Davao del Norte",
  "Davao del Sur",
  "Davao Occidental",
  "Davao Oriental",
  "Dinagat Islands",
  "Eastern Samar",
  "Guimaras",
  "Ifugao",
  "Ilocos Norte",
  "Ilocos Sur",
  "Iloilo",
  "Isabela",
  "Kalinga",
  "La Union",
  "Laguna",
  "Lanao del Norte",
  "Lanao del Sur",
  "Leyte",
  "Maguindanao",
  "Marinduque",
  "Masbate",
  "Metro Manila",
  "Misamis Occidental",
  "Misamis Oriental",
  "Mountain Province",
  "Negros Occidental",
  "Negros Oriental",
  "Northern Samar",
  "Nueva Ecija",
  "Nueva Vizcaya",
  "Occidental Mindoro",
  "Oriental Mindoro",
  "Palawan",
  "Pampanga",
  "Pangasinan",
  "Quezon",
  "Quirino",
  "Rizal",
  "Romblon",
  "Samar",
  "Sarangani",
  "Siquijor",
  "Sorsogon",
  "South Cotabato",
  "Southern Leyte",
  "Sultan Kudarat",
  "Sulu",
  "Surigao del Norte",
  "Surigao del Sur",
  "Tarlac",
  "Tawi-Tawi",
  "Zambales",
  "Zamboanga del Norte",
  "Zamboanga del Sur",
  "Zamboanga Sibugay",
];

export const getPostById = (postId?: string): DummyPost => {
  const foundPost = dummyPosts.find((post) => post.$id === postId);

  if (foundPost) {
    return foundPost;
  }
  return {
    creator: {
      id: "",
      firstName: "",
      lastName: "",
      imageUrl: "",
    },
    $id: "",
    $createdAt: "",
    province: "",
    municipal: "",
    caption: "",
    imageUrl: "",
  };
};

export const getUserById = (userId?: string) => {
  const foundUser = dummyUser.find((users) => users.id === userId);

  if (foundUser) {
    return foundUser;
  }
  return {
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
    posts: [],
  };
};
