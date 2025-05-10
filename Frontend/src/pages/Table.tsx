import { useEffect, useState } from "react";
import axiosInstance from "../config/axios.config";

interface Asset {
  id: number;
  name: string;
  status: string;
  assignedTo: {
    username: string;
  };
}

const AssetsTable = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const userData = localStorage.getItem("userData");
        const token = userData ? JSON.parse(userData).token : null;
        setLoading(true);
        const response = await axiosInstance.get("/assets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssets(response.data);
        setFilteredAssets(response.data); // Set initial filtered list
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAssets(assets);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(lowerSearch) ||
          asset.status.toLowerCase().includes(lowerSearch) ||
          asset.assignedTo.username.toLowerCase().includes(lowerSearch)
      );
      setFilteredAssets(filtered);
    }
  }, [searchTerm, assets]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 py-4 bg-white px-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for assets"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block pt-2 ps-10 py-2 text-sm text-gray-900 border border-blue-500 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="" className="me-8">
            Filtered by
          </label>
          <button
            className="inline-flex items-center text-blue-600 bg-white border border-blue-500 hover:bg-blue-100 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-3 py-1.5"
            type="button"
          >
            Status
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-white uppercase bg-blue-600">
          <tr>
            <th className="px-6 py-3">Id</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Assigned To</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : filteredAssets.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                No assets found.
              </td>
            </tr>
          ) : (
            filteredAssets.map((asset) => (
              <tr key={asset.id} className="bg-white border-b hover:bg-blue-50">
                <td className="px-6 py-4">{asset.id}</td>
                <td className="px-6 py-4">{asset.name}</td>
                <td className="px-6 py-4">{asset.status}</td>
                <td className="px-6 py-4">
                  {asset.assignedTo?.username || "None"}
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <button
                    title="Edit"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828z" />
                      <path
                        fillRule="evenodd"
                        d="M2 5a2 2 0 0 1 2-2h6a1 1 0 1 1 0 2H4v10h10v-6a1 1 0 1 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    title="Delete"
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 0 0-1 1v1H5a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2h-3V3a1 1 0 0 0-1-1H9zM4 7h12l-.867 10.142A2 2 0 0 1 13.138 19H6.862a2 2 0 0 1-1.995-1.858L4 7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetsTable;
