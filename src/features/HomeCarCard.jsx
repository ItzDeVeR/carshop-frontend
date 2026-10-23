export default function HomeCarCard({
  title,
  mileage,
  engineDisplacement,
  power,
  transmission,
  secondaryMarketPrice,
  turnkeyPrice,
  img,
}) {
  return (
    <div className="flex flex-col gap-y-6 rounded-[20px] bg-white px-6 py-5">
      <div className="h-full w-full">
        <img alt="car" src={img} className="h-auto w-84" />
      </div>

      <div className="flex flex-col gap-y-4">
        <p className="text-2xl font-bold">{title}</p>

        <div className="flex items-baseline">
          <p className="text-black/50">Пробег</p>
          <div className="grow border-b border-dashed border-gray-500" />
          <p className="text-xl font-semibold">{mileage} км</p>
        </div>

        <div className="flex items-baseline">
          <p className="text-black/50">Объем двигателя</p>
          <div className="grow border-b border-dashed border-gray-500" />
          <p className="text-xl font-semibold">{engineDisplacement}</p>
        </div>

        <div className="flex items-baseline">
          <p className="text-black/50">Мощность</p>
          <div className="grow border-b border-dashed border-gray-500" />
          <p className="text-xl font-semibold">{power} л.с.</p>
        </div>

        <div className="flex items-baseline">
          <p className="text-black/50">Коробка</p>
          <div className="grow border-b border-dashed border-gray-500" />
          <p className="text-xl font-semibold">{transmission}</p>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between gap-x-4.25">
          <p className="leading-5">Цена на вторичном рынке РФ</p>
          <p className="text-2xl text-nowrap">{secondaryMarketPrice}₽</p>
        </div>

        <div className="flex justify-between gap-x-4">
          <p className="leading-5">Цена автомобиля "под ключ"</p>
          <p className="text-2xl font-black text-nowrap text-[#FA002C]">
            {turnkeyPrice}₽
          </p>
        </div>
      </div>

      <button className="mx-auto w-full cursor-pointer rounded-xl bg-[#F50E30] py-4 text-xl font-medium text-white md:mx-0 md:px-10 md:text-2xl md:font-bold">
        Оставить заявку
      </button>
    </div>
  );
}
