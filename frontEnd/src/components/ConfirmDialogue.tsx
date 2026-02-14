import { useState, useRef } from "react";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolverRef = useRef<(value: boolean) => void>(null);

  const confirm = (opts: ConfirmOptions = {}) => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const handleClose = () => {
    resolverRef.current?.(false);
    setIsOpen(false);
  };

  const handleConfirm = () => {
    resolverRef.current?.(true);
    setIsOpen(false);
  };

  const ConfirmDialog = isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="bg-gray-900 border text-gray-100 rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg  font-bold mb-2">
          {options.title ?? "Are you sure?"}
        </h2>
        <p className="mb-4 text-gray-200">
          {options.description ?? "This action cannot be undone."}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 rounded bg-green-200 hover:bg-green-300"
          >
            {options.cancelText ?? "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {options.confirmText ?? "Delete"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ConfirmDialog };
}

export { useConfirm };

/* function UserList() {
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async (userId: string) => {
    const ok = await confirm({
      title: "Delete user",
      description: "This action cannot be undone.",
      confirmText: "Delete",
    });

    if (!ok) return;

    // Call your delete API here
    console.log("User deleted:", userId);
  };

  return (
    <>
      <ul>
        <li>
          John Doe{" "}
          <button
            className="text-red-600 hover:underline"
            onClick={() => handleDelete("123")}
          >
            Delete
          </button>
        </li>
        <li>
          Jane Smith{" "}
          <button
            className="text-red-600 hover:underline"
            onClick={() => handleDelete("124")}
          >
            Delete
          </button>
        </li>
      </ul>

      {ConfirmDialog}
    </>
  );
}
 */
