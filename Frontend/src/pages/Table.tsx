import { useEffect, useState } from "react";
import axiosInstance from "../config/axios.config";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Asset {
  id: number;
  name: string;
  status: string;
  assignedTo: {
    username: string;
    id: number;
  };
}

interface Employee {
  id: number;
  username: string;
}
interface AssetHistory {
  id: number;
  status: string;
  timestamp: string;
}
const AssetsTable = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetStatus, setNewAssetStatus] = useState("");
  const [newAssetAssignedTo, setNewAssetAssignedTo] = useState<number>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedAssignedTo, setUpdatedAssignedTo] = useState<number>();
  const [updatedName, setUpdatedName] = useState("");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const userData = localStorage.getItem("userData");
  if (!userData) {
    navigate("/login");
  }
  const role = userData ? JSON.parse(userData).role : null;
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [assetHistory, setAssetHistory] = useState<AssetHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Add function to fetch and display history
  const handleShowHistory = async (assetId: number) => {
    try {
      setLoadingHistory(true);
      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).token : null;

      const response = await axiosInstance.get(`/assets/${assetId}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssetHistory(response.data);
      setIsHistoryModalOpen(true);
    } catch (error) {
      console.error("Error fetching asset history:", error);
      toast.error("Failed to fetch asset history");
    } finally {
      setLoadingHistory(false);
    }
  };
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
  // Add toggle function for history modal
  const toggleHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setAssetHistory([]);
  };
  // Status options array
  const statusOptions = ["Available", "In_Use", "Under_Maintenance"];

  // Add filter by status function
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    if (status === "") {
      // If no status selected, show all assets
      setFilteredAssets(assets);
    } else {
      // Filter assets by selected status
      const filtered = assets.filter((asset) => asset.status === status);
      setFilteredAssets(filtered);
    }
    setIsStatusFilterOpen(false); // Close dropdown after selection
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setNewAssetName(""); // Reset form when modal is toggled
  };

  const toggleDeleteModal = (asset?: Asset) => {
    if (asset) {
      setSelectedAsset(asset);
      setIsDeleteModalOpen(true);
    } else {
      setSelectedAsset(null);
      setIsDeleteModalOpen(false);
    }
  };
  const toggleUpdateModal = (asset?: Asset) => {
    if (asset) {
      setSelectedAsset(asset);
      setUpdatedName(asset.name); // Initialize with current name
      setUpdatedStatus(asset.status);
      setUpdatedAssignedTo(asset.assignedTo?.id);
      setIsUpdateModalOpen(true);
    } else {
      setSelectedAsset(null);
      setUpdatedName("");
      setUpdatedStatus("");
      setUpdatedAssignedTo(undefined);
      setIsUpdateModalOpen(false);
    }
  };
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
      setFilteredAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAssets_employee = async () => {
    try {
      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).token : null;
      const id = userData ? JSON.parse(userData).id : null;
      setLoading(true);
      const response = await axiosInstance.get(`/assets/asset_user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssets(response.data);
      setFilteredAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployees = async () => {
    try {
      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).token : null;
      const response = await axiosInstance.get("/assets/get_employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).token : null;
      if (!newAssetName || !newAssetStatus) {
        toast.error("Please fill in all required fields");
        return;
      }

      const requestBody = {
        name: newAssetName,
        status: newAssetStatus,
        assignedToId: newAssetAssignedTo || null, // If no employee is selected, send null
      };

      await axiosInstance.post("/assets", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Asset created successfully");

      // Clear form and close modal
      setNewAssetName("");
      setNewAssetStatus("");
      setNewAssetAssignedTo(undefined);
      toggleModal();

      // Refresh assets list
      await fetchAssets();
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };
  const handleDelete = async () => {
    if (!selectedAsset) return;

    try {
      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).token : null;

      await axiosInstance.delete(`/assets/${selectedAsset.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Asset deleted successfully");
      toggleDeleteModal();
      await fetchAssets();
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("Failed to delete asset");
    }
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAsset) return;

    try {
      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).token : null;

      if (!updatedName || !updatedStatus) {
        toast.error("Please fill in all required fields");
        return;
      }

      const requestBody = {
        name: updatedName,
        status: updatedStatus,
        assignedToId: updatedAssignedTo || null,
      };

      await axiosInstance.put(`/assets/${selectedAsset.id}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Asset updated successfully");
      toggleUpdateModal();
      if (role === "ADMIN") await fetchAssets();
      else await fetchAssets_employee();
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error("Failed to update asset");
    }
  };

  useEffect(() => {
    if (role === "ADMIN") {
      fetchAssets();
      fetchEmployees();
    } else {
      fetchAssets_employee();
    }
  }, [role]);
  useEffect(() => {
    let filtered = assets;

    // Apply search term filter
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(lowerSearch) ||
          asset.status.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply status filter
    if (selectedStatus !== "") {
      filtered = filtered.filter((asset) => asset.status === selectedStatus);
    }

    setFilteredAssets(filtered);
  }, [searchTerm, assets, selectedStatus]);
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
            className="block pt-2 ps-10 py-2 text-sm text-gray-900 border border-blue-500 rounded-lg w-80 outline-none bg-white focus:ring-blue-600 focus:border-blue-700"
          />
        </div>
        <div className="relative">
          <label htmlFor="" className="me-8">
            Filtered by
          </label>
          <button
            className={`inline-flex items-center ${
              selectedStatus
                ? "text-white bg-blue-600"
                : "text-blue-600 bg-white"
            } border border-blue-500  focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-3 py-1.5`}
            type="button"
            onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
          >
            {selectedStatus || "Status"}
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

          {/* Status Filter Dropdown */}
          {isStatusFilterOpen && (
            <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <button
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                    onClick={() => handleStatusFilter("")}
                  >
                    All
                  </button>
                </li>
                {statusOptions.map((status) => (
                  <li key={status}>
                    <button
                      className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleStatusFilter(status)}
                    >
                      {status.replace("_", " ")}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {role === "ADMIN" && (
          <Button width="w-fit" onClick={toggleModal}>
            Add New Asset
          </Button>
        )}
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
                    onClick={() => toggleUpdateModal(asset)}
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
                  {role === "ADMIN" && (
                    <>
                      <button
                        title="History"
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => {
                          setSelectedAsset(asset);
                          handleShowHistory(asset.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => toggleDeleteModal(asset)}
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
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        closeModal={toggleModal}
        title="Add New Asset"
        description=""
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Asset Name"
            value={newAssetName}
            onChange={(e) => setNewAssetName(e.target.value)}
            required
          />
          <div className="flex items-center gap-4">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              className="border border-gray-300 rounded-lg p-2"
              value={newAssetStatus}
              onChange={(e) => setNewAssetStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="In_Use">In Use</option>
              <option value="Under_Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="employee">Assign to:</label>
            <select
              id="employee"
              className="border border-gray-300 rounded-lg p-2"
              value={newAssetAssignedTo}
              onChange={(e) => setNewAssetAssignedTo(parseInt(e.target.value))}
            >
              <option value="" disabled selected>
                Select Employee
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.username}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        closeModal={() => toggleDeleteModal()}
        title="Delete Asset"
        description="Are you sure you want to delete this asset? This action cannot be undone."
      >
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-600">
            Asset Name:{" "}
            <span className="font-medium">{selectedAsset?.name}</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => toggleDeleteModal()}
              className="bg-gray-400 hover:bg-gray-500 "
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isUpdateModalOpen}
        closeModal={() => toggleUpdateModal()}
        title="Update Asset"
        description=""
      >
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {role === "ADMIN" && (
              <Input
                placeholder="Asset Name"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                required
              />
            )}

            <div className="flex items-center gap-4">
              <label htmlFor="updateStatus">Status:</label>
              <select
                id="updateStatus"
                className="border border-gray-300 rounded-lg p-2 flex-1"
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                {role === "ADMIN" && (
                  <>
                    <option value="In_Use">In Use</option>
                  </>
                )}
                <option value="Available">Available</option>
                <option value="Under_Maintenance">Maintenance</option>
              </select>
            </div>

            {role === "ADMIN" && (
              <div className="flex items-center gap-4">
                <label htmlFor="updateEmployee">Assign to:</label>
                <select
                  id="updateEmployee"
                  className="border border-gray-300 rounded-lg p-2 flex-1"
                  value={updatedAssignedTo}
                  onChange={(e) =>
                    setUpdatedAssignedTo(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                >
                  <option value="">None</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.username}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => toggleUpdateModal()}
              className="bg-gray-400 hover:bg-gray-500"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update
            </Button>
          </div>
        </form>
      </Modal>
      {/* History Modal */}
      {/* History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        closeModal={toggleHistoryModal}
        title={`Asset History - ${selectedAsset?.name}`}
        description=""
      >
        <div className="flex flex-col gap-4">
          {loadingHistory ? (
            <div className="text-center py-4">Loading history...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-white uppercase bg-blue-600">
                  <tr>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Start Date</th>
                    <th className="px-4 py-2">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assetHistory.map((history, index) => (
                    <tr
                      key={history.id}
                      className="bg-white border-b hover:bg-blue-50"
                    >
                      <td className="px-4 py-2">
                        {history.status.replace("_", " ")}
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(history.timestamp)}
                      </td>
                      <td className="px-4 py-2">
                        {index < assetHistory.length - 1
                          ? formatDate(assetHistory[index + 1].timestamp)
                          : "Current"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button
              onClick={toggleHistoryModal}
              className="bg-gray-400 hover:bg-gray-500"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssetsTable;
