import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaSearch, FaEdit, FaEye, FaTimes } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { adminAPI, API_BASE_URL } from "../services/api";

function Cards() {
  const { isDarkMode } = useTheme();
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editCard, setEditCard] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewCard, setViewCard] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const cardsPerPage = 8;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch cards when debounced search or page changes
  useEffect(() => {
    fetchCards();
  }, [debouncedSearch, currentPage]);

  const fetchCards = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getCards();
      console.log("Card API", response.data);

      const allCards = response.data.data.cards;

      setCards(allCards);

      const calculatedTotalPages = Math.ceil(allCards.length / cardsPerPage);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const handleDelete = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await adminAPI.deleteCard(cardId);
        fetchCards();
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    }
  };

  const handleEdit = (card) => {
    setEditCard({ ...card });
    setShowEditModal(true);
  };

  const handleView = (card) => {
    setViewCard(card);
    setShowViewModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateCard(editCard._id, editCard);
      setShowEditModal(false);
      fetchCards();
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedCards = cards.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div className="min-h-screen md:mt-6">
      <div className="mb-8">
        <h1
          className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Business Cards
        </h1>
        <p
          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Manage and view all business cards
        </p>
      </div>

      {/* Search Bar */}
      <div
        className={`rounded-lg md:rounded-2xl p-3 md:p-6 mb-3 md:mb-6 transition-all duration-300 ${isDarkMode ? "bg-gray-800/60 backdrop-blur-xl border border-gray-700/50" : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg"}`}
      >
        <div className="relative group">
          <FaSearch
            className={`absolute top-1/2 transform -translate-y-1/2 left-3 text-xs md:text-base transition-colors duration-300 ${isDarkMode ? "text-gray-500 group-hover:text-blue-400" : "text-gray-400 group-hover:text-blue-500"}`}
            size={18}
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className={`w-full pl-8 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl border-2 transition-all duration-300 font-medium ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700"
                : "bg-gray-50 border-gray-200 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
            } focus:outline-none focus:shadow-lg focus:shadow-blue-500/20`}
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <button
              onClick={clearSearch}
              className={`absolute top-1/2 transform -translate-y-1/2 right-4 p-2 rounded-lg transition-colors ${isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div
          className={`rounded-2xl p-12 ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Loading cards...
            </p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && cards.length === 0 && (
        <div
          className={`rounded-2xl p-12 ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}
        >
          <div className="text-center">
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {debouncedSearch
                ? `No cards found for "${debouncedSearch}"`
                : "No cards found"}
            </p>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && cards.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {paginatedCards.map((card) => (
              <div
                key={card._id}
                onClick={(e) => {
                  if (!e.target.closest("button")) handleView(card);
                }}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg hover:shadow-xl"}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`${API_BASE_URL.replace("/api", "")}${card.imageUrl}`}
                    alt="Business Card"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <FaEye className="text-white" size={24} />
                  </div>
                </div>
                <div className="p-5">
                  <h3
                    className={`font-bold text-lg mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {card.name}
                  </h3>
                  <p
                    className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {card.email}
                  </p>
                  <div
                    className={`flex justify-between items-center pt-3 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <span
                      className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                    >
                      By: {card.user?.name || "Unknown"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(card);
                        }}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(card._id);
                        }}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <MdOutlineDelete size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div
            className={`flex justify-between items-center p-6 rounded-2xl ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}
          >
            <span
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + cardsPerPage, cards.length)} of{" "}
              {cards.length} cards
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"}`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"}`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl p-6 w-full max-w-md ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-2xl transform transition-all`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Edit Card
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <FaTimes
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={editCard?.name || ""}
                  onChange={(e) =>
                    setEditCard({ ...editCard, name: e.target.value })
                  }
                  className={`w-full p-2 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={editCard?.email || ""}
                  onChange={(e) =>
                    setEditCard({ ...editCard, email: e.target.value })
                  }
                  className={`w-full p-2 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Phone"
                  value={editCard?.phone || ""}
                  onChange={(e) =>
                    setEditCard({ ...editCard, phone: e.target.value })
                  }
                  className={`w-full p-2 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Company"
                  value={editCard?.company || ""}
                  onChange={(e) =>
                    setEditCard({ ...editCard, company: e.target.value })
                  }
                  className={`w-full p-2 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl p-6 w-full max-w-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-2xl transform transition-all`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Card Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <FaTimes
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                />
              </button>
            </div>
            <img
              src={`${API_BASE_URL.replace("/api", "")}${viewCard.imageUrl}`}
              alt="Business Card"
              className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
            />
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Name
                </p>
                <p
                  className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  {viewCard?.name}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Email
                </p>
                <p
                  className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  {viewCard?.email}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Phone
                </p>
                <p
                  className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  {viewCard?.phone}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Company
                </p>
                <p
                  className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  {viewCard?.company}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Uploaded by
                  </p>
                  <p
                    className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {viewCard?.user?.name}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Created
                  </p>
                  <p
                    className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {new Date(viewCard?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;