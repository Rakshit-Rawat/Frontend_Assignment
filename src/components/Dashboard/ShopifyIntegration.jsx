import React from "react";
import Shopify from "../../assets/shopify.svg";

export default function ShopifyIntegration({ onConnect }) {
  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      storeUrl: form.get("storeUrl")?.trim(),
      apiKey: form.get("apiKey")?.trim(),
    };
    onConnect?.(payload); // optional callback
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-green-100 mr-3">
          <img src={Shopify} alt="Shopify" className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-gray-800">Shopify Integration</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Connect your Shopify store to sync data.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <input
          name="storeUrl"
          placeholder="Store URL"
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          name="apiKey"
          placeholder="API Key (dummy)"
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md"
        >
          Connect
        </button>
      </form>
    </div>
  );
}
