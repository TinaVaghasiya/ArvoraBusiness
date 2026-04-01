import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaSearch, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { adminAPI, API_BASE_URL } from "../services/api";
import { useSearchParams } from "react-router-dom";
import { FiInfo } from "react-icons/fi";

export default function Cards() {
  const { isDarkMode } = useTheme();
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editCard, setEditCard] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewCard, setViewCard] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const filterUserId = searchParams.get("userId");
  const filterUserName = searchParams.get("userName");
  const filter = searchParams.get("filter");
  const cardsPerPage = 10;

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    const count = search
      ? cards.filter((c) =>
        [c.name, c.email, c.phone, c.company, c.user?.name]
          .some((val) => val?.toLowerCase().includes(search.toLowerCase()))
      ).length
      : cards.length;
    setTotalPages(Math.ceil(count / cardsPerPage) || 1);
    setCurrentPage(1);
  }, [search, cards]);

  const fetchCards = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getCards();
      console.log("Card API", response.data);

      let allCards = response.data.data.cards;

      if (filter === "todayScans") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        allCards = allCards.filter(card => {
          const createdDate = new Date(card.createdAt);
          createdDate.setHours(0, 0, 0, 0);
          return createdDate.getTime() === today.getTime();
        });
      }

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

  const handleView = (card) => { setViewCard(card); setShowViewModal(true); };

  const handleEdit = (card) => {
    const formattedCard = {
      ...card,
      phone: validatePhone(card.phone || "")
    };
    setEditCard(formattedCard);
    setFieldErrors({ name: "", email: "", phone: "", company: "" }); // Clear all errors
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!validateAllFields()) {
      return;
    }

    try {
      await adminAPI.updateCard(editCard._id, editCard);
      setShowEditModal(false);
      fetchCards();
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const filteredCards = cards.filter((card) => {
    const matchesUser = filterUserId ? card.user?._id === filterUserId : true;
    const matchesSearch = search
      ? [card.name, card.email, card.phone, card.company, card.user?.name]
          .some((val) => val?.toLowerCase().includes(search.toLowerCase()))
      : true;
    return matchesUser && matchesSearch;
  });

  const totalPagesCalculated = Math.ceil(filteredCards.length / cardsPerPage);

  const startIndex = (currentPage - 1) * cardsPerPage;

  const paginatedCards = filteredCards.slice(
    startIndex,
    startIndex + cardsPerPage,
  );

  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPages();

  const validateName = (value) => {
    return value.replace(/[0-9]/g, '');
  };
  const validatePhone = (value) => {
    if (!value) return '';
    const numbers = value.split(/[\n,]/)
      .map(num => num.trim())
      .filter(num => num.length > 0)
      .map(num => {
        const hasPlus = num.startsWith('+');
        const cleaned = num.replace(/[^0-9+\-\s()]/g, '');
        if (hasPlus && !cleaned.startsWith('+')) {
          return '+' + cleaned.replace(/\+/g, '');
        }

        return cleaned;
      });
    return numbers.join(', ');
  };
  const validateEmail = (value) => {
    return value.replace(/[^a-zA-Z0-9@._-]/g, '');
  };

  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (fieldName, value) => {
    const errors = { ...fieldErrors };

    switch (fieldName) {
      case 'name':
        errors.name = !value?.trim() ? "Please enter a name" : "";
        break;
      case 'email':
        if (!value?.trim()) {
          errors.email = "Please enter an email";
        } else if (!validateEmailFormat(value)) {
          errors.email = "Please enter a valid email";
        } else {
          errors.email = "";
        }
        break;
      case 'phone':
        errors.phone = !value?.trim() ? "Please enter a phone number" : "";
        break;
      case 'company':
        errors.company = !value?.trim() ? "Please enter a company name" : "";
        break;
    }

    setFieldErrors(errors);
  };

  const handleFieldChange = (fieldName, value) => {
    let processedValue = value;
    if (fieldName === 'name') {
      processedValue = validateName(value);
    } else if (fieldName === 'phone') {
      processedValue = validatePhone(value);
    }
    setEditCard({ ...editCard, [fieldName]: processedValue });
    validateField(fieldName, processedValue);
  };

  const validateAllFields = () => {
    const errors = {};
    errors.name = !editCard?.name?.trim() ? "Please enter a name" : "";
    if (!editCard?.email?.trim()) {
      errors.email = "Please enter an email";
    } 
    errors.phone = !editCard?.phone?.trim() ? "Please enter a phone number" : "";
    setFieldErrors(errors);
    return !Object.values(errors).some(error => error !== "");
  };

  return (
    <div className="min-h-screen md:mt-6 mt-3">
      <div className="mb-3 md:mb-6">
        <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {filter === "todayScans" ? "Today's Scanned Cards" : "Business Cards"}
        </h1>
        <p className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {filter === "todayScans" ? "Cards scanned today" : filterUserId ? `Viewing cards uploaded by ${filterUserName}` : "Manage and view all business cards"}
        </p>
      </div>

      {/* Search Bar */}
      <div
        className={`rounded-lg md:rounded-2xl p-3 md:p-6 mb-4 md:mb-6 transition-all duration-300 ${isDarkMode ? "bg-gray-800/60 backdrop-blur-xl border border-gray-700/50" : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg"}`}
      >
        <div className="relative group">
          <FaSearch
            className={`absolute top-1/2 transform -translate-y-1/2 left-3 text-xs md:text-base transition-colors duration-300 ${isDarkMode ? "text-gray-500 group-hover:text-blue-400" : "text-gray-400 group-hover:text-blue-500"}`}
            size={18}
          />
          <input
            type="text"
            placeholder="Search cards by name or email..."
            className={`w-full pl-8 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl border-2 transition-all duration-300 font-medium ${isDarkMode
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

      {(filterUserId || filter) && (
        <div className={`mb-3 md:mb-4 flex items-center ${filterUserId ? 'justify-between' : ''} gap-2 px-3 py-2 rounded-lg text-xs md:text-sm ${isDarkMode ? "bg-blue-900/30 text-blue-300 border border-blue-800" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
          <div className="flex items-center gap-2">
            <FiInfo size={18} />
            <span>
              {filter === "todayScans" ? "Showing today's scanned cards" : `Filtered by user: `}
              {filterUserId && <span className="font-semibold">{filterUserName}</span>}
            </span>
          </div>
          {filterUserId && (
            <button
              onClick={() => setSearchParams({})}
              className="flex items-center gap-1 hover:underline"
            >
              <FaTimes size={10} /> Clear
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className={`rounded-lg md:rounded-2xl p-6 md:p-12 ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}>
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2 md:mb-4"></div>
            <p className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Loading cards...</p>
          </div>
        </div>
      ) : (
        <div className={`rounded-lg md:rounded-2xl overflow-hidden ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}>
          {filteredCards.length === 0 ? (
            <div className="p-12 text-center">
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {search ? `No cards found for "${search}"` : filter === "todayScans" ? "No cards scanned today." : "No cards scanned yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}>
                    <th className={`text-left py-2 px-3 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider w-10 md:w-12 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Sr no.</th>
                    <th className={`text-left py-2 px-3 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Name</th>
                    <th className={`text-left py-2 px-3 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email</th>
                    <th className={`text-left py-2 px-3 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Phone</th>
                    <th className={`text-left py-2 px-3 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Created</th>
                    <th className={`text-left py-2 px-3 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                  {paginatedCards.map((card, index) => (
                    <tr
                      key={card._id}
                      onClick={(e) => { if (!e.target.closest("button")) handleView(card); }}
                     className={`cursor-pointer transition-colors ${card.isDeleted ? (isDarkMode ? "bg-red-900/20" : "bg-red-50") : (isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50")}`}
                    >
                      <td className={`py-2 px-3 md:px-4 text-xs font-medium w-10 md:w-12 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {startIndex + index + 1}
                      </td>
                      <td className={`py-2 px-3 md:px-4 text-xs md:text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                        <div className="flex items-center gap-2">
                          <span className="truncate block max-w-[80px] md:max-w-none">{card.name || "-"}</span>
                          {card.isDeleted && (
                            <span className={`px-2 py-0.5 text-[10px] rounded  whitespace-nowrap ${isDarkMode ? "bg-red-800/30 text-red-300" : "bg-red-100 text-red-600"}`}>Deleted</span>
                          )}
                        </div>
                      </td>
                      <td className={`py-2 px-3 md:px-4 text-xs text-left md:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {card.email || "-"}
                      </td>
                      <td className={`py-2 px-3 md:px-4 text-xs md:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {card.phone?.split(/[\n,]/)[0]?.trim() || "-"}
                      </td>
                      <td className={`py-2 px-3 md:px-4 text-xs md:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {new Date(card.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 md:px-4">
                        <div className="flex gap-1 md:gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(card); }}
                            className={`p-1 md:p-2 rounded-lg  text-blue-600 transition-colors ${isDarkMode ? "hover:text-blue-600 bg-blue-900/40" : "hover:bg-blue-200 bg-blue-100 "}`}
                          >
                            <FaEdit size={12} className="md:w-4 md:h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(card._id); }}
                            className={`p-1 md:p-2 rounded-lg  transition-colors ${isDarkMode ? "bg-red-900/30 hover:text-red-900/50 text-red-400" : "hover:bg-red-200 bg-red-100 text-red-700"}`}
                          >
                            <FaTrash size={12} className="md:w-4 md:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredCards.length > 0 && (
            <div className={`flex items-center justify-center p-3 md:p-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"} `}>
              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm
                ${currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800"
                    }`}
                >
                  ← Back
                </button>
                {pages.map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="px-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium
                        ${isDarkMode ? "text-gray-300" : "text-gray-700"}
                        ${currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPagesCalculated))
                  }
                  disabled={currentPage === totalPagesCalculated}
                  className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm
                ${currentPage === totalPagesCalculated
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800"
                    }`}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex md:items-center items-start md:pt-6 pt-24 justify-center z-50 px-6">
          <div
            className={`rounded-2xl p-6 w-full max-w-md ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-2xl transform transition-all`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg md:text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
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
            <div className="md:space-y-3 space-y-2">
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={editCard?.name || ""}
                  onChange={(e) =>
                    handleFieldChange('name', e.target.value)
                  }
                  className={`w-full p-2 md:p-2 text-xs rounded-xl border-2 focus:outline-none focus:ring-2 ${fieldErrors.name ? "ring-red-500" : "focus:ring-blue-500"} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
                {fieldErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={editCard?.email || ""}
                  onChange={(e) =>
                    handleFieldChange('email', e.target.value)
                  }
                  className={`w-full p-2 text-xs rounded-xl border-2 focus:outline-none focus:ring-2 ${fieldErrors.email ? "ring-red-500" : "focus:ring-blue-500"} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                )}
              </div>
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Phone"
                  value={editCard?.phone || ""}
                  onChange={(e) =>
                    handleFieldChange('phone', e.target.value)
                  }
                  className={`w-full p-2 text-xs rounded-xl border-2 focus:outline-none focus:ring-2 ${fieldErrors.phone ? "ring-red-500" : "focus:ring-blue-500"} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
                {fieldErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                )}
              </div>
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Website </label>
                <input
                  type="text"
                  placeholder="Website"
                  value={editCard?.website || ""}
                  onChange={(e) =>
                    handleFieldChange('website', e.target.value)
                  }
                  className={`w-full p-2 text-xs rounded-xl border-2 focus:outline-none focus:ring-2 ${fieldErrors.website ? "ring-red-500" : "focus:ring-blue-500"} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
                {fieldErrors.website && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.website}</p>
                )}
              </div>
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Company"
                  value={editCard?.company || ""}
                  onChange={(e) =>
                    handleFieldChange('company', e.target.value)
                  }
                  className={`w-full p-2 text-xs rounded-xl border-2 focus:outline-none focus:ring-2 ${fieldErrors.company ? "ring-red-500" : "focus:ring-blue-500"} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
                {fieldErrors.company && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.company}</p>
                )}
              </div>
              <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl font-medium transition-all ${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex md:items-center items-start md:justify-center justify-center pt-24 md:pt-6 z-50 p-4">
          <div className={`rounded-2xl w-auto md:w-full max-w-sm flex flex-col ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-2xl`}>
            <div className="flex justify-between items-center p-3 shrink-0">
              <h3 className={`text-sm md:text-base font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Card Details</h3>
              <button onClick={() => setShowViewModal(false)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                <FaTimes size={13} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
              </button>
            </div>
            <div className="px-3 pb-3 space-y-1 md:space-y-2">
              <img
                src={`${API_BASE_URL.replace("/api", "")}${viewCard.imageUrl}`}
                alt="Business Card"
                className="w-full object-contain rounded-lg shadow-md"
                style={{ maxHeight: "160px" }}
              />
              {[
                { label: "Name", value: viewCard?.name },
                { label: "Email", value: viewCard?.email || "N/A" },
                { label: "Phone", value: viewCard?.phone?.split(/[\n,]/).map(num => num.trim()).filter(num => num).join(', ') || "N/A" },
                { label: "Website", value: viewCard?.website || "N/A" },
                { label: "Company", value: viewCard?.company || "N/A" },
              ].map(({ label, value }) => (
                <div key={label} className={`p-2 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-[10px] font-medium mb-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
                  <p className={`font-semibold text-xs ${isDarkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-[10px] font-medium mb-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Uploaded by</p>
                  <p className={`font-semibold text-xs ${isDarkMode ? "text-white" : "text-gray-900"}`}>{viewCard?.user?.name || "Unknown"}</p>
                </div>
                <div className={`p-2 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-[10px] font-medium mb-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Created on</p>
                  <p className={`font-semibold text-xs ${isDarkMode ? "text-white" : "text-gray-900"}`}>{new Date(viewCard?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};