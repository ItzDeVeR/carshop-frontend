import { useState } from "react";
import Container from "../components/Container";
import HomeCarCard from "../features/HomeCarCard";
import Advantages from "../features/HomePage/Advantages";

const carsData = [
  {
    id: 1,
    title: "VW Polo Sedan 2012",
    mileage: "5 700",
    engineDisplacement: 2.0,
    power: 149,
    transmission: "Автомат",
    secondaryMarketPrice: "3 300 000",
    turnkeyPrice: "2 700 000",
    img: "vwpolos/vw_polo_2012_concept_beige_titanium.png",
  },
  {
    id: 2,
    title: "VW Polo Sedan 2012",
    mileage: "12 400",
    engineDisplacement: 1.6,
    power: 123,
    transmission: "Автомат",
    secondaryMarketPrice: "2 400 000",
    turnkeyPrice: "1 950 000",
    img: "vwpolos/vw_polo_2012_concept_black.png",
  },
  {
    id: 3,
    title: "VW Polo Sedan 2012",
    mileage: "35 000",
    engineDisplacement: 2.5,
    power: 194,
    transmission: "Автомат",
    secondaryMarketPrice: "3 800 000",
    turnkeyPrice: "3 100 000",
    img: "vwpolos/vw_polo_2012_concept_blue_night.png",
  },
  {
    id: 4,
    title: "VW Polo Sedan 2012",
    mileage: "48 200",
    engineDisplacement: 2.0,
    power: 249,
    transmission: "Робот",
    secondaryMarketPrice: "4 600 000",
    turnkeyPrice: "3 850 000",
    img: "vwpolos/vw_polo_2012_concept_brown_toffee.png",
  },
  {
    id: 5,
    title: "VW Polo Sedan 2012",
    mileage: "18 900",
    engineDisplacement: 1.5,
    power: 150,
    transmission: "Робот",
    secondaryMarketPrice: "2 900 000",
    turnkeyPrice: "2 350 000",
    img: "vwpolos/vw_polo_2012_concept_grey_petalit.png",
  },
  {
    id: 6,
    title: "VW Polo Sedan 2012",
    mileage: "62 000",
    engineDisplacement: 3.0,
    power: 340,
    transmission: "Автомат",
    secondaryMarketPrice: "6 200 000",
    turnkeyPrice: "5 100 000",
    img: "vwpolos/vw_polo_2012_concept_silver_reflex.png",
  },
  {
    id: 7,
    title: "VW Polo Sedan 2012",
    mileage: "8 100",
    engineDisplacement: 1.4,
    power: 150,
    transmission: "Механика",
    secondaryMarketPrice: "2 150 000",
    turnkeyPrice: "1 750 000",
    img: "vwpolos/vw_polo_2012_concept_white_candy.png",
  },
  {
    id: 8,
    title: "VW Polo Sedan 2012",
    mileage: "27 500",
    engineDisplacement: 2.0,
    power: 190,
    transmission: "Автомат",
    secondaryMarketPrice: "3 950 000",
    turnkeyPrice: "3 250 000",
    img: "vwpolos/vw_polo_beige_highline.png",
  },
  {
    id: 9,
    title: "VW Polo Sedan 2012",
    mileage: "15 300",
    engineDisplacement: 2.4,
    power: 181,
    transmission: "Вариатор",
    secondaryMarketPrice: "3 100 000",
    turnkeyPrice: "2 500 000",
    img: "vwpolos/vw_polo_beige_sedan.png",
  },
];

function ProsCard({ icon, title, description }) {
  return (
    <div className="flex min-h-55 flex-col rounded-3xl border border-gray-100 bg-white p-6 md:p-8">
      <div className="order-2 mb-4 flex flex-col gap-y-4 md:order-1">
        <p className="hidden text-2xl leading-tight font-bold text-gray-900 md:block md:text-4xl">
          {title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 md:mt-0 md:text-base">
          {description}
        </p>
      </div>
      <div className="order-1 flex items-center justify-between md:order-2 md:grow md:justify-end">
        <img
          className="h-auto w-24 object-contain md:w-auto"
          src={icon}
          alt={title}
        />
        <p className="grow text-center text-2xl leading-tight font-bold text-gray-900 md:hidden">
          {title}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(carsData.length / itemsPerPage);

  const visibleCars = carsData.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage,
  );

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <>

      <Container className="mt-8 mb-11 flex w-full flex-col justify-between md:mt-28 md:flex-row">
        <div className="flex flex-col gap-y-5">
          <p className="text-center text-4xl leading-9 font-black md:text-start md:text-[52px] md:leading-15.5">
            Купите автомобиль
            <br />
            дешевле на 60%*
          </p>

          <div className="flex w-full shrink-0 items-center md:hidden">
            <img
              src="/landcar.png"
              alt="landcar"
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-y-5">
            <p className="text-center text-xl leading-6 font-medium md:text-start md:leading-8">
              Привезем автомобиль под ключ со всеми документами.
              <br />
              Подбор автомобиля под любой запрос БЕСПЛАТНО
            </p>

            <button className="mx-auto w-fit cursor-pointer rounded-xl bg-[#F50E30] px-13 py-4 text-2xl font-medium text-white md:mx-0 md:font-bold">
              Оставить заявку
            </button>
          </div>
        </div>

        <div className="hidden w-full shrink-0 items-center md:flex md:w-1/2 md:max-w-162.5">
          <img
            src="/landcar.png"
            alt="landcar"
            className="h-auto w-full object-cover"
          />
        </div>
      </Container>

      <Container className="flex w-full flex-col items-center gap-y-10 bg-[#F4F6F8] py-16 md:py-30">
        <div className="flex flex-col items-center gap-y-6">
          <p className="text-center text-[30px] leading-9 font-extrabold md:text-[54px] md:leading-11">
            Поможем вам выгодно купить и привезти
            <br />
            автомобиль в любую точку России
          </p>
          <p className="text-center text-lg leading-6 md:text-2xl md:leading-8">
            Предлагаем Вам купить автомобиль дешевле и лучше, но за тот же
            бюджет
          </p>
        </div>

        <button className="order-3 mx-auto w-full cursor-pointer rounded-xl bg-[#F50E30] px-13 py-4 text-2xl font-medium text-white md:order-0 md:mx-0 md:w-fit md:font-bold">
          Оставить заявку
        </button>

        <div className="flex flex-col gap-x-6 gap-y-3 md:flex-row">
          <ProsCard
            icon="/pros1.png"
            title="С пробегом"
            description="Предлагаем купить автомобиль дешевле до 60%, от рыночной цены на Авито и Авто.ру"
          />

          <ProsCard
            icon="/pros2.png"
            title="Новые"
            description="Предлагаем Вам купить автомобиль дешевле до 60%, от рыночной ценына Авито и Авто.ру"
          />

          <ProsCard
            icon="/pros3.png"
            title="Под ваш бюджет"
            description="Предлагаем купить автомобиль дешевле до 60%, от рыночной цены на Авито и Авто.ру"
          />
        </div>
      </Container>

      <div className="grid grid-cols-1 gap-y-8 pb-16 md:grid-cols-2 md:gap-25 md:pb-0">
        <div className="h-full w-full">
          <img
            alt="about"
            src="/aboutus.png"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-y-6 px-4 md:my-12 md:px-0">
          <p className="text-2xl font-bold md:text-[44px] md:font-black">
            О нас
          </p>

          <p className="leading-6 md:hidden">
            Предлагаем Вам купить автомобиль
            <br />
            дешевле или лучше, но за тот же бюджет.
          </p>

          <p className="hidden text-2xl leading-8 md:block">
            Мы автосалон и официальный партнер
            <br />
            крупнейших мировых авто-аукционов: IAA
            <br />
            (Insurance Auto Auction), Copart, Manheim.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 md:gap-6">
              <img alt="about car" src="/aboutcar_icon.svg" />
              <p className="font-medium md:text-xl">Работаем без посредников</p>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <img alt="about exp" src="/aboutexp_icon.svg" />
              <p className="font-medium md:text-xl">Успешный опыт 10 лет</p>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <img alt="about log" src="/aboutlog_icon.svg" />
              <p className="font-medium md:text-xl">Отлаженная логистика</p>
            </div>
          </div>

          <div className="rounded-[10px] border-[3px] border-[#FA002C]/15 px-5 py-3 md:w-fit">
            <p className="leading-6 font-medium md:text-xl">
              Мы берем на себя полное сопровождение сделки
              <br />
              до передачи автомобиля в руки клиенту.
            </p>
          </div>

          <button className="mx-auto w-full cursor-pointer rounded-xl bg-[#F50E30] py-4 text-xl font-medium text-white md:order-0 md:mx-0 md:w-fit md:px-10 md:text-2xl md:font-bold">
            Оставить заявку
          </button>
        </div>
      </div>

      <Container className="flex flex-col gap-y-10 bg-[#F4F6F8] py-25">
        <div className="flex flex-col gap-y-5">
          <p className="text-[44px] leading-13.5 font-extrabold">
            Какие авто привозим?
          </p>
          <p className="text-2xl">
            Привозим авто не старше 7 лет на момент растаможки.
          </p>
        </div>

        <div className="relative">
          <img
            src="/arrow_left.svg"
            alt="arrow_left"
            className="absolute top-[38%] left-2 z-10 h-10 w-10 cursor-pointer rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white md:top-[32%] md:left-2 md:h-12 md:w-12 lg:-left-13 lg:h-16 lg:w-16 lg:bg-transparent lg:p-0 lg:shadow-none"
            onClick={handlePrev}
          />

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: totalPages }, (_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="flex w-full shrink-0 flex-col items-center gap-y-6 md:flex-row md:justify-between md:gap-x-4 lg:gap-x-6"
                >
                  {carsData
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage,
                    )
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className={`w-full max-w-85 md:max-w-none ${index > 0 ? "hidden md:block" : "block"}`}
                      >
                        <HomeCarCard {...item} />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <img
            src="/arrow_right.svg"
            alt="arrow_right"
            className="absolute top-[38%] right-2 z-10 h-10 w-10 cursor-pointer rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white md:top-[32%] md:right-2 md:h-12 md:w-12 lg:-right-13 lg:h-16 lg:w-16 lg:bg-transparent lg:p-0 lg:shadow-none"
            onClick={handleNext}
          />

          <div className="mt-6 flex justify-center gap-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <div
                key={index}
                onClick={() => setPage(index)}
                className={`cursor-pointer ${
                  index === page ? "bg-[#FA002C]" : "bg-black/10"
                } h-1 w-12 transition-all md:w-20 lg:w-25`}
              />
            ))}
          </div>
        </div>
      </Container>

      <Container className="flex flex-col gap-x-10.5 gap-y-5 bg-white py-16 md:flex-row">
        <div className="order-2 flex flex-1 flex-col gap-y-8 md:order-1">
          <div className="flex flex-col gap-y-5">
            <p className="text-[28px] leading-9 font-bold md:text-[44px] md:leading-13.5">
              Мы советуем подбирать автомобиль с бюджетом от{" "}
              <span className="text-[#F50E30]">1,3 млн</span>
            </p>
            <p className="leading-6 md:text-xl">
              c учетом расходов на доставку, растаможку и наши услуги.
            </p>
          </div>

          <button className="mx-auto w-full cursor-pointer rounded-xl bg-[#F50E30] px-10 py-4 text-2xl font-medium text-white md:mx-0 md:w-fit md:font-bold">
            Оставить заявку
          </button>
        </div>

        <div className="order-1 flex-1 md:order-2">
          <img
            src="vwpolos/coolPolo.png"
            alt="ourOffer"
            className="h-full rounded-[20px] object-cover md:w-100 md:max-w-200"
          />
        </div>
      </Container>

      <Advantages />
    </>
  );
}
