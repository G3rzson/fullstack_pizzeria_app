export default function EmptyList({ text }: { text: string }) {
  return (
    <div className="centered-container">
      <p className="text-center text-xl sm:text-3xl">{text}</p>
    </div>
  );
}
