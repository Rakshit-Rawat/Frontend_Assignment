import Amazon from "../../assets/Amazon.svg";

export default function AmazonIntegration({ onConnect }) {
  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      email: form.get("email")?.trim(),
      store: form.get("store")?.trim(),
    };
    onConnect?.(payload); // optional callback
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-orange-100 mr-3">
          <img src={Amazon} alt="Amazon" className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-gray-800">Amazon Integration</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Connect your Amazon account to sync data.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          name="store"
          placeholder="Store name"
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all shadow-md"
        >
          Connect
        </button>
      </form>
    </div>
  );
}
