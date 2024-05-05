import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Content = [
  {
    key: 1,
    content: "Connect and exchange cultures through posting, commenting, and sharing online",
    image: "https://cdn-icons-png.freepik.com/512/4187/4187272.png",
  },
  {
    key: 2,
    content:
      "Report posts to prevent spam, misleading content, misinformation, and inappropriate posts through report module",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ50EITXSwNc7YppclKUf1aVwuq01ItHD9GQ_X9QrNbw&s",
  },
  {
    key: 3,
    content:
      "View cultural content based on their interest and likings through content-based filtering algorithms",
    image:
      "https://sloanreview.mit.edu/wp-content/uploads/2018/10/MAG-Ransbotham-Ratings-Recommendations-1200X627-1200x627.jpg",
  },
  {
    key: 4,
    content:
      "Censoring or preventing posts that contain words that may cause intentional or unintentional harm through a word filtering module",
    image:
      "https://images.squarespace-cdn.com/content/v1/57eac831bebafbd78901d3ef/1543355322176-ZGT1EB9X1DY2H92BXWV2/censored-stamp-vector-16520329.jpg",
  },
  {
    key: 5,
    content:
      "View an events calendar to stay updated to the latest cultural events that are happening all around the Philippines through calendar module",
    image: "https://time.ly/wp-content/uploads/2022/06/year-view-popup-1.jpg",
  },
  {
    key: 6,
    content:
      "Use an interactive map that shows the history, cultural events, heritage sites, and cultural contents of specific municipalities in the Philippines through digital map module",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0FljLuBx2_HBrHKaSfA2Yj6AtN7qryGsAu9mZr_NUFQ&s",
  },

  {
    key: 7,
    content:
      "Administrators can maintain a digital archive that showcases a catalog of the diverse cultural heritage of the Philippines such as historical documents, pictures of artifacts, monuments, and buildings through the digital archive module",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzUutwk7XbGm7NQ6wFTUnFrMhrGXqqsyxBbyYUm728jQ&s",
  },
  {
    key: 8,
    content:
      "Allowing users to livestream current cultural events happening in their area through livestream module",
    image:
      "https://prod-images.dacast.com/wp-content/uploads/2021/03/benefits-of-live-streaming.jpg",
  },
];

const Features = () => {
  return (
    <>
      <span className="flex justify-center w-full text-lg font-bold" id="features">
        Features
      </span>
      <div className="w-full bg-primary-1 py-16 px-4">
        <div className="max-w-[1240px] mx-auto grid">
          <Carousel
            opts={{
              align: "start",
            }}
            orientation="vertical"
            className="w-full lg:max-w-[1080px] xs:max-w-screen-sm mx-auto"
          >
            <CarouselContent className="-mt-1 h-[300px]">
              {Content.map((content) => (
                <CarouselItem key={content.key} className="pt-1 basis-1">
                  <div className="p-1">
                    <Card className="h-full w-full">
                      <CardContent className="flex items-center justify-center gap-5 h-[290px] p-0">
                        {content.key % 2 ? (
                          <>
                            <img
                              src={content.image}
                              alt="image"
                              className="object-cover aspect-square w-1/2 h-full"
                            />
                            <span className="lg:text-2xl xs:text-lg font-semibold">
                              {content.content}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="lg:text-2xl xs:text-lg font-semibold">
                              {content.content}
                            </span>
                            <img
                              src={content.image}
                              alt="image"
                              className="object-cover aspect-square w-1/2 h-full"
                            />
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default Features;
