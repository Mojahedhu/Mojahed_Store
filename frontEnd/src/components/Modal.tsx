const Modal = ({
  isOpen,
  onClose,
  setValue,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  setValue?: (value: string) => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-black/50 text-right border border-pink-500">
            <button
              className="text-white bg-pink-500 hover:bg-pink-700 px-1 py-0.5 font-semibold hover:text-gray-700 focus:outline-none mr-2 rounded-sm"
              onClick={() => {
                onClose();
                if (setValue) setValue("");
              }}
            >
              X
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export { Modal };
