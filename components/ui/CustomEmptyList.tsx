export default function CustomEmptyList({ message }: { message: string }) {
  return (
    <div className="flex grow items-center justify-center">
      <p className="text-center text-muted-foreground text-h3 text-balance">
        {message}
      </p>
    </div>
  );
}
