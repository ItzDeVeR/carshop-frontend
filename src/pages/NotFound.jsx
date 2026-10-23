import { Link } from "react-router-dom";
import Container from "../components/Container";

export default function NotFound() {
  return (
    <Container className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-y-6 text-center">
        <p className="text-6xl font-black text-[#F50E30]">Ой,</p>
        <p className="text-2xl font-extrabold">Кажется Вы потерялись :с</p>

        <img src="/notfound.png" alt="notfoundpng" className="h-auto w-128" />

        <Link
          to={"/"}
          className="w-full cursor-pointer rounded-xl bg-[#F50E30] px-10 py-4 text-2xl font-medium text-white transition-opacity hover:opacity-90"
        >
          На Главную
        </Link>
      </div>
    </Container>
  );
}
