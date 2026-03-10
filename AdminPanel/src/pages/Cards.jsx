import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { adminAPI } from "../services/api";

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
      const response = await adminAPI.getCards(currentPage, debouncedSearch);
      setCards(response.data.cards);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching cards:', error);
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
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await adminAPI.deleteCard(cardId);
        fetchCards();
      } catch (error) {
        console.error('Error deleting card:', error);
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
      console.error('Error updating card:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <h1 className="text-3xl font-bold mb-8">Business Cards</h1>

      {/* Search Bar */}
      <div className={`rounded-xl shadow-lg p-6 mb-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="relative">
          <FaSearch className={`absolute top-1/2 transform -translate-y-1/2 left-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search cards by name or company..."
            className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300"}`}
            value={search}
            onChange={handleSearchChange}
          />
          {search && (
            <button
              onClick={clearSearch}
              className={`absolute top-1/2 transform -translate-y-1/2 right-3 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={`rounded-xl shadow-lg p-6 mb-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="text-center">Loading cards...</div>
        </div>
      )}

      {/* No Results */}
      {!loading && cards.length === 0 && (
        <div className={`rounded-xl shadow-lg p-6 mb-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="text-center">
            {debouncedSearch ? `No cards found for "${debouncedSearch}"` : "No cards found"}
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && cards.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {cards.map((card) => (
              <div key={card._id} className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <img 
                  src={card.imageUrl || "https://via.placeholder.com/300x180"} 
                  alt="Business Card" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{card.name}</h3>
                  <p className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{card.email}</p>
                  <p className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{card.phone}</p>
                  <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{card.company}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                      By: {card.user?.name || 'Unknown'}
                    </span>
                    <div className="flex space-x-2">
                      <button onClick={() => handleView(card)} className="text-blue-600 hover:text-blue-800">
                        <FaEye size={16} />
                      </button>
                      <button onClick={() => handleEdit(card)} className="text-green-600 hover:text-green-800">
                        <FaEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(card._id)} className="text-red-600 hover:text-red-800">
                        <MdOutlineDelete size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-96 max-h-96 overflow-y-auto ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Card</h3>
              <button onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editCard?.name || ''}
                onChange={(e) => setEditCard({...editCard, name: e.target.value})}
                className={`w-full p-2 rounded border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              <input
                type="email"
                placeholder="Email"
                value={editCard?.email || ''}
                onChange={(e) => setEditCard({...editCard, email: e.target.value})}
                className={`w-full p-2 rounded border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              <input
                type="text"
                placeholder="Phone"
                value={editCard?.phone || ''}
                onChange={(e) => setEditCard({...editCard, phone: e.target.value})}
                className={`w-full p-2 rounded border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              <input
                type="text"
                placeholder="Company"
                value={editCard?.company || ''}
                onChange={(e) => setEditCard({...editCard, company: e.target.value})}
                className={`w-full p-2 rounded border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              <div className="flex space-x-2">
                <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save
                </button>
                <button onClick={() => setShowEditModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-96 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Card Details</h3>
              <button onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
            <img 
              src={viewCard?.imageUrl || "https://via.placeholder.com/300x180"} 
              alt="Business Card" 
              className="w-full h-48 object-cover rounded mb-4" 
            />
            <div className="space-y-2">
              <p><strong>Name:</strong> {viewCard?.name}</p>
              <p><strong>Email:</strong> {viewCard?.email}</p>
              <p><strong>Phone:</strong> {viewCard?.phone}</p>
              <p><strong>Company:</strong> {viewCard?.company}</p>
              <p><strong>Uploaded by:</strong> {viewCard?.user?.name}</p>
              <p><strong>Created:</strong> {new Date(viewCard?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
