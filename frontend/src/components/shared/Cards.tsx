const Cards = () => {
  return (
    <div className="w-full py-[10rem] px-4 bg-white text-center" id="team">
      <h1 className="mb-8">Meet our team!</h1>
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-4 gap-8">
        <div className="w-full shadow-xl flex flex-col my-4 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-full bg-white aspect-square object-cover  rounded-t-lg"
            src="https://pbs.twimg.com/media/FpFAjHbaEAErEKq?format=jpg&name=medium"
            alt="/"
          />
          <h2 className="text-2xl font-bold text-center py-8">Jean Claudine Anilao</h2>
        </div>
        <div className="w-full shadow-xl flex flex-col my-4 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-full bg-white rounded-t-lg"
            src="https://scontent-mnl1-1.xx.fbcdn.net/v/t1.6435-1/66105374_10211758713563300_7358675207491420160_n.jpg?stp=dst-jpg_p200x200&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGNXRY7hH7ULMx9Nn19dmvHeY2D-QrZsCh5jYP5CtmwKIV0ehf_sWRYe-DikXsEc0J0lEpT94Y43I_HGfJ6pFnG&_nc_ohc=JPDFOt3AilQQ7kNvgEd4G5u&_nc_ht=scontent-mnl1-1.xx&oh=00_AfAFi2PT0vne0G4I_0WQD-Ndjtdw3uQxBxKM-Je4nQqtnA&oe=665EEBE5"
            alt="/"
          />
          <h2 className="text-2xl font-bold text-center py-8">Roiel Carlos</h2>
        </div>
        <div className="w-full shadow-xl flex flex-col my-4 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-full  rounded-t-lg bg-white object-cover aspect-square"
            src="https://scontent.fcrk4-2.fna.fbcdn.net/v/t39.30808-6/278473795_1392569134497987_3558211687315908932_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFq2Ns10vMMyDMO4eEIdiqdRxWE6PzaDTRHFYTo_NoNNK87DTgDLGjNEQfUF9PYkbL3Kez5YOlCOhm3M8Eudj0l&_nc_ohc=C5RbZxb7ENcQ7kNvgEbf9u-&_nc_ht=scontent.fcrk4-2.fna&oh=00_AfBuzpC6Ew8AEaGyvKwhNQ0EfUbp7vylKaYlGr7IBumaNg&oe=663D4542"
            alt="/"
          />
          <h2 className="text-2xl font-bold text-center py-8">Regee Casaña</h2>
        </div>
        <div className="w-full shadow-xl flex flex-col  my-4 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-full rounded-t-lg bg-white object-cover aspect-square"
            src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRPLWOaEpeLoHDdZP3EAomM-UEGinjjy3io_YzriqsQ503ZME-97do9ph6b7px27dHzBkxKHc16BpVSJ5E"
            alt="/"
          />
          <h2 className="text-2xl font-bold text-center py-8">Andrei Lazo</h2>
        </div>
      </div>
    </div>
  );
};

export default Cards;
