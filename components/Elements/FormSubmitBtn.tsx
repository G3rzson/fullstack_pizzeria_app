type Props = {
  children: React.ReactNode;
  isSubmitting: boolean;
};

export default function FormSubmitBtn({ children, isSubmitting }: Props) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-green-800 px-4 py-2"
    >
      {children}
    </button>
  );
}
