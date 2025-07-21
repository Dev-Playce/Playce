export default function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="text-gray-400 text-center py-12 text-base select-none">
      {message}
    </div>
  );
}
