

export default function Header({ user, onSignOut }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-[14px] flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800">Data Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <img src={user?.photoURL} alt="avatar" className="w-10 h-10 rounded-full border-2 border-gray-200" />
          <button
            onClick={onSignOut}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
