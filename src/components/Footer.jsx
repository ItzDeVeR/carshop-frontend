import Container from "./Container";

export default function Footer() {
  return (
    <footer className="h-14 bg-gray-600">
      <Container className="h-full">
        <div className="flex h-full items-center justify-between text-base font-medium text-white">
          <img className="h-12 w-auto" src="/micon.png" alt="logo" />
          <p>© 2026 “MotorImport”</p>
          <p>Все права защищены</p>
        </div>
      </Container>
    </footer>
  );
}
