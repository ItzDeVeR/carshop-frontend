export default function Container({ children, className = "" }) {
  return (
    <div className={`w-full px-4 xl:px-32 2xl:px-80 ${className}`}>
      {children}
    </div>
  );
}
