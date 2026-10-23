export default function Loader({ text }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20">
      <div className="relative w-full max-w-2xl">
        <img
          alt="empty_polik"
          src="/vwpolos/vw_polo_body_empty_arches_black.png"
          className="h-auto w-full object-contain"
        />

        <img
          src="/vw_wheel.png"
          className="absolute top-[64%] left-[17%] w-[13%] animate-spin object-contain"
          alt="wheel"
        />

        <img
          src="/vw_wheel.png"
          className="absolute top-[64%] right-[14.4%] w-[13%] animate-spin object-contain"
          alt="wheel"
        />
      </div>

      <h1 className="text-center text-xl font-medium text-gray-700">{text}</h1>
    </div>
  );
}
