import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { PackagePlus, Trash2 } from "lucide-react";

const HEALCOIN_TO_RUPEE_RATE = 0.01;

const formatRupee = (value) => {
  const numeric = typeof value === "number" ? value : Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numeric);
};

const GoodieOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goodies, setGoodies] = useState([]);
  const [goodiesLoading, setGoodiesLoading] = useState(true);
  const [newGoodie, setNewGoodie] = useState({
    title: "",
    coins: "",
    description: "",
    imageUrl: ""
  });
  const [isCreatingGoodie, setIsCreatingGoodie] = useState(false);
  const [goodieFormErrors, setGoodieFormErrors] = useState({});
  const [imageUploadError, setImageUploadError] = useState("");
  const [deletingGoodieId, setDeletingGoodieId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const modalBodyOverflowRef = useRef("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { socket } = useSocket();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/goodie-orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Failed to load goodie orders:", error);
      toast.error("Failed to load goodie orders");
    } finally {
      setLoading(false);
    }
  };

  const loadGoodies = async () => {
    try {
      setGoodiesLoading(true);
      const res = await api.get("/api/admin/goodies");
      setGoodies(res.data.goodies || []);
    } catch (error) {
      console.error("Failed to load goodies:", error);
      toast.error("Failed to load goodies");
    } finally {
      setGoodiesLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadGoodies();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNew = (order) => {
      setOrders((prev) => {
        if (prev.some((o) => o._id === order._id)) {
          return prev;
        }
        return [order, ...prev];
      });
    };
    const handleUpdate = (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    };
    const handleNewGoodie = (goodie) => {
      setGoodies((prev) => {
        if (prev.some((g) => g._id === goodie._id)) {
          return prev;
        }
        return [goodie, ...prev];
      });
    };
    const handleDeletedGoodie = (goodie) => {
      setGoodies((prev) => prev.filter((item) => item._id !== goodie._id));
    };
    socket.on("goodie:order", handleNew);
    socket.on("goodie:order:update", handleUpdate);
    socket.on("goodie:catalog:new", handleNewGoodie);
    socket.on("goodie:catalog:delete", handleDeletedGoodie);
    return () => {
      socket.off("goodie:order", handleNew);
      socket.off("goodie:order:update", handleUpdate);
      socket.off("goodie:catalog:new", handleNewGoodie);
      socket.off("goodie:catalog:delete", handleDeletedGoodie);
    };
  }, [socket]);

  const handleNewGoodieChange = (field, value) => {
    setNewGoodie((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const resetNewGoodieForm = () => {
    setNewGoodie({
      title: "",
      coins: "",
      description: "",
      imageUrl: ""
    });
    setGoodieFormErrors({});
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageUploadError("");
      handleNewGoodieChange("imageUrl", "");
      return;
    }

    const minBytes = 5 * 1024 * 1024;
    if (file.size < minBytes) {
      setImageUploadError("File must be at least 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleNewGoodieChange("imageUrl", reader.result.toString());
      setImageUploadError("");
    };
    reader.onerror = () => {
      setImageUploadError("Unable to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateGoodie = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!newGoodie.title.trim()) {
      errors.title = "Title is required";
    }
    if (!newGoodie.coins || Number(newGoodie.coins) <= 0) {
      errors.coins = "Coin value is required";
    }

    if (Object.keys(errors).length) {
      setGoodieFormErrors(errors);
      return;
    }

    setIsCreatingGoodie(true);
    try {
      const response = await api.post("/api/admin/goodies", {
        title: newGoodie.title.trim(),
        coins: Number(newGoodie.coins),
        description: newGoodie.description.trim(),
        imageUrl: newGoodie.imageUrl.trim()
      });
      const createdGoodie = response.data.goodie;
      setGoodies((prev) => [createdGoodie, ...prev]);
      toast.success("Goodie created successfully");
      resetNewGoodieForm();
    } catch (error) {
      console.error("Failed to create goodie:", error);
      const message = error.response?.data?.error || "Failed to create goodie";
      toast.error(message);
    } finally {
      setIsCreatingGoodie(false);
    }
  };

  const handleDeleteGoodie = async (goodieId) => {
    if (!goodieId) return;
    const confirmed = window.confirm("Are you sure you want to delete this goodie?");
    if (!confirmed) return;
    setDeletingGoodieId(goodieId);
    try {
      await api.delete(`/api/admin/goodies/${goodieId}`);
      setGoodies((prev) => prev.filter((goodie) => goodie._id !== goodieId));
      toast.success("Goodie removed");
    } catch (error) {
      console.error("Failed to delete goodie:", error);
      toast.error(error.response?.data?.error || "Failed to delete goodie");
    } finally {
      setDeletingGoodieId(null);
    }
  };

  const openCreateModal = () => {
    resetNewGoodieForm();
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (showCreateModal) {
      modalBodyOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = modalBodyOverflowRef.current || "";
    }

    return () => {
      document.body.style.overflow = modalBodyOverflowRef.current || "";
    };
  }, [showCreateModal]);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await api.patch(`/api/admin/goodie-orders/${orderId}`, { status });
      setOrders((prev) => prev.map((order) => (order._id === orderId ? res.data.order : order)));
      toast.success("Order status updated");
    } catch (error) {
      console.error("Failed to update status:", error);
      const message = error.response?.data?.error || "Failed to update goodie status";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Loading goodie requests...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => filterStatus === "all" || order.status === filterStatus);
  const hasOrders = orders.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="bg-white shadow rounded-3xl border border-gray-100 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-sm text-indigo-600 uppercase tracking-widest">Fulfillment</p>
              <h1 className="text-3xl font-bold text-gray-900">Goodie Orders</h1>
            </div>
            <span className="text-sm text-gray-500">
              Total requests: {orders.length}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            These requests are created when students redeem HealCoins for goodies. Mark them delivered once the parcel is shipped.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {["all", "requested", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                filterStatus === status
                  ? status === "delivered"
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : status === "requested"
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg hover:opacity-90"
          >
            Create Goodie
          </button>
        </div>

        <div className="bg-white border border-gray-100 shadow rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-indigo-500">Catalog</p>
              <h2 className="text-2xl font-bold text-gray-900">Goodies Library</h2>
            </div>
            <span className="text-sm text-gray-500">
              {goodies.length} saved item{goodies.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Students will see active goodness once you create them here. The catalog updates instantly for everyone.
            </p>
            {goodiesLoading ? (
              <div className="rounded-2xl border border-gray-100 p-4 text-center text-gray-500">Loading goodies…</div>
            ) : goodies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                No goodies available yet. Create one to seed the catalog.
              </div>
            ) : (
              <div className="space-y-4">
                {goodies.map((goodie) => (
                  <div key={goodie._id} className="border border-gray-100 rounded-2xl p-4 shadow-sm bg-white">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{goodie.title}</p>
                        <p className="text-xs text-gray-500">{goodie.description || "No description"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            goodie.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {goodie.isActive ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => handleDeleteGoodie(goodie._id)}
                          disabled={deletingGoodieId === goodie._id}
                          className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                          {deletingGoodieId === goodie._id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Cost</p>
                        <p className="text-2xl font-black text-indigo-700 flex items-center gap-1">
                          <span>{(goodie.coins || 0).toLocaleString()}</span>
                          <span className="text-xs text-gray-500">
                            {formatRupee((goodie.coins || 0) * HEALCOIN_TO_RUPEE_RATE)}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Created {new Date(goodie.createdAt || goodie.updatedAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!hasOrders ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-10 text-center text-gray-600">
            <PackagePlus className="w-10 h-10 mx-auto text-indigo-500 mb-4" />
            <p className="text-lg font-semibold">No goodie orders yet</p>
            <p className="text-sm mt-2">All requests will appear here in real time.</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-10 text-center text-gray-600">
            <PackagePlus className="w-10 h-10 mx-auto text-indigo-500 mb-4" />
            <p className="text-lg font-semibold">No {filterStatus === "all" ? "" : `${filterStatus} `}orders</p>
            <p className="text-sm mt-2">Try switching filters.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{order.goodieTitle}</p>
                    <p className="text-sm text-gray-500">Requested on {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    <div className="text-sm text-gray-500">
                      {order.coins.toLocaleString()} HealCoins ≈ {formatRupee(order.coins * HEALCOIN_TO_RUPEE_RATE)}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Student</p>
                    <p className="font-semibold text-gray-900">{order.userName}</p>
                    {order.userEmail && <p>{order.userEmail}</p>}
                    {order.contactNumber && <p>Contact: {order.contactNumber}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      Balance before: {order.healCoinsBefore?.toLocaleString() || 0}
                      {" • "}
                      after: {order.healCoinsAfter?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Delivery Address</p>
                    <p>{order.address?.line1 || "N/A"}</p>
                    {order.address?.line2 && <p>{order.address.line2}</p>}
                    <p>
                      {order.address?.city}, {order.address?.state} {order.address?.pincode}
                    </p>
                    {order.address?.instructions && <p className="text-xs text-gray-400">Note: {order.address.instructions}</p>}
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-3">
                  <button
                    onClick={() => handleStatusChange(order._id, "requested")}
                    disabled={order.status === "requested"}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${order.status === "requested" ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"}`}
                  >
                    Requested
                  </button>
                  <button
                    onClick={() => handleStatusChange(order._id, "delivered")}
                    disabled={order.status === "delivered"}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${order.status === "delivered" ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-emerald-500 text-white shadow-lg hover:brightness-110"}`}
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={closeCreateModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
              aria-label="Close create goodie modal"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Goodie</h3>
            <form onSubmit={handleCreateGoodie} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Title</label>
                <input
                  type="text"
                  value={newGoodie.title}
                  onChange={(event) => handleNewGoodieChange("title", event.target.value)}
                  className={`w-full rounded-2xl border px-3 py-2 text-sm transition ${
                    goodieFormErrors.title ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {goodieFormErrors.title && (
                  <p className="text-xs text-red-500 mt-1">{goodieFormErrors.title}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">HealCoins Cost</label>
                <input
                  type="number"
                  min={1}
                  value={newGoodie.coins}
                  onChange={(event) => handleNewGoodieChange("coins", event.target.value)}
                  className={`w-full rounded-2xl border px-3 py-2 text-sm transition ${
                    goodieFormErrors.coins ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {goodieFormErrors.coins && (
                  <p className="text-xs text-red-500 mt-1">{goodieFormErrors.coins}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Description</label>
                <textarea
                  value={newGoodie.description}
                  onChange={(event) => handleNewGoodieChange("description", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm transition resize-none"
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase">Image URL (optional)</label>
                  <input
                    type="url"
                    value={newGoodie.imageUrl}
                    onChange={(event) => handleNewGoodieChange("imageUrl", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase">Upload Image (min 5 MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm transition file:cursor-pointer file:border-0 file:bg-indigo-50 file:text-indigo-600 file:px-3"
                  />
                  {imageUploadError && <p className="text-xs text-red-500 mt-1">{imageUploadError}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isCreatingGoodie}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg hover:opacity-90 disabled:opacity-50"
                >
                  {isCreatingGoodie ? "Creating…" : "Create Goodie"}
                </button>
                <button
                  type="button"
                  onClick={resetNewGoodieForm}
                  className="px-5 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodieOrders;
