const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}: {
  value: string;
  setValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  buttonText?: string;
  handleDelete?: () => void;
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="px-4 py-3 border border-lg w-full"
          placeholder="Write Category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex justify-between">
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50 active:bg-pink-800 active:scale-x-95">
            {buttonText}
          </button>
          {handleDelete && (
            <button
              type="button"
              className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 active:bg-pink-800 active:scale-x-95"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export { CategoryForm };
