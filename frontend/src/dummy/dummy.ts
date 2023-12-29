// dummy.ts

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
    $id: "12345314316",
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
    $id: "1234455456",
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

export const getPostById = (postId?: string): DummyPost => {
  const foundPost = dummyPosts.find((post) => post.$id === postId);

  if (foundPost) {
    return foundPost;
  }

  // Return a default DummyPost object if not found
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
