export default function CustomError({ message }: { message: string }) {
  return (
    <div className="flex grow items-center justify-center">
      <p className="text-center text-destructive text-h3 text-balance">
        {message}
      </p>
    </div>
  );
}
