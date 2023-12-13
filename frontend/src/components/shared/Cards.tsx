const Cards = () => {
  return (
    <div className="w-full py-[10rem] px-4 bg-white text-center">
      <h1 className="mb-8">Meet our team!</h1>
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-4 gap-8">
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          <img className="w-20 mx-auto mt-[-3rem] bg-white" alt="/" />
          <h2 className="text-2xl font-bold text-center py-8">Jean Claudine Anilao</h2>
        </div>
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          <img className="w-20 mx-auto mt-[-3rem] bg-white" alt="/" />
          <h2 className="text-2xl font-bold text-center py-8">Roiel Carlos</h2>
        </div>
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          <img className="w-20 mx-auto mt-[-3rem] bg-white" alt="/" />
          <h2 className="text-2xl font-bold text-center py-8">Regee Casaña</h2>
        </div>
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          <img className="w-20 mx-auto mt-[-3rem] bg-white" alt="/" />
          <h2 className="text-2xl font-bold text-center py-8">Andrei Lazo</h2>
        </div>
      </div>
    </div>
  );
};

export default Cards;
