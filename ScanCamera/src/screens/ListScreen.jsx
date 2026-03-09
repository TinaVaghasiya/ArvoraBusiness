import {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Keyboard,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";
import "../utils/api";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ListScreen() {
  const defaultFields = ["name", "phone", "company_or_email"];
  const navigation = useNavigation();
  const searchInputRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allCards, setAllCards] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("recent");
  const [tempSort, setTempSort] = useState("recent");
  const insets = useSafeAreaInsets();
  const toggleSort = (key) => {
    setTempSort((prev) => (prev === key ? null : key));
  };
  const fetchCards = async () => {
  try {
    setLoading(true);
    
    const token = await AsyncStorage.getItem("userToken");
    
    const response = await fetch(`${BASE_API}/api/cards/get-cards`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    console.log("📥 Cards from backend:", data);
    
    setAllCards(data.data);
    const sorted = sortCards(data.data, selectedSort);
    setCards(sorted);
  } catch (error) {
    console.log("❌ Server Error:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchCards();
  //   }, []),
  // );

  useFocusEffect(
    useCallback(() => {
      fetchCards().then(data => {
        const sorted = sortCards(data, selectedSort);
        setCards(sorted);
      });
    }, [selectedSort])
  );
  const onRefresh = () => {
    setRefreshing(true);
    fetchCards();
  };
  const handleSearch = useCallback(
    (text) => {
      setSearch(text);
      if (text === "") {
        setCards(allCards);
        return;
      }
      const filteredData = allCards.filter((item) => {
        const searchText = text.toLowerCase();
        return (
          item.name?.toLowerCase().includes(searchText) ||
          item.company?.toLowerCase().includes(searchText) ||
          item.email?.toLowerCase().includes(searchText) ||
          item.phone?.toLowerCase().includes(searchText)
        );
      });
      setCards(filteredData);
    },
    [allCards],
  );
  const sortCards = (cardsToSort, sortType) => {
    const sorted = [...cardsToSort];
    const getSortableValue = (card) => {
      return (card.name || card.company || card.email || "").toLowerCase();
    };
    switch (sortType) {
      case "az":
        return sorted.sort((a, b) =>
          getSortableValue(a).localeCompare(getSortableValue(b))
        );
      case "za":
        return sorted.sort((a, b) =>
          getSortableValue(b).localeCompare(getSortableValue(a))
        );
      case "recent":
      default:
        return sorted.reverse();
    }
  };
  useEffect(() => {
    let timer;
    if (isSearching) {
      timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 250);
    }
    return () => clearTimeout(timer);
  }, [isSearching]);
  useEffect(() => {
    const backAction = () => {
      if (isSearching) {
        setIsSearching(false);
        setSearch("");
        setCards(allCards);
        Keyboard.dismiss();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [isSearching, allCards]);
  useEffect(() => {
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      if (isSearching) {
        setIsSearching(false);
        setSearch("");
        setCards(allCards);
      }
    });
    return () => hideListener.remove();
  }, [isSearching, allCards]);
  useLayoutEffect(() => {
    {
      /* header logic */
    }
    navigation.setOptions({
      headerStyle: {
        height: 95,
        backgroundColor: "#618af0",
        paddingTop: 45,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
      },
      headerTintColor: "#fff",
      headerTitle: isSearching
        ? () => (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#928e8e"
              ref={searchInputRef}
              value={search}
              onChangeText={handleSearch}
              style={styles.searchInput}
            />
            {search.length > 0 && (
              <TouchableOpacity
                style={styles.clearIcon}
                onPress={() => {
                  if (search.length > 0) {
                    setSearch("");
                    setCards(allCards);
                  } else {
                    Keyboard.dismiss();
                    setIsSearching(false);
                  }
                }}
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        )
        : "Business Cards",
      headerRight: () => (
        <View style={styles.headerRight}>
          {isSearching ? (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => {
                Keyboard.dismiss();
                setIsSearching(false);
                setSearch("");
                setCards(allCards);
              }}
            >
              {/* <Ionicons name="close" size={23} color="#686767" /> */}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => setIsSearching(true)}
            >
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              setTempSort(selectedSort);
              setSortVisible(true);
            }}
          >
            <Ionicons name="swap-vertical" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isSearching, allCards, search, handleSearch]);
  useEffect(() => {
    if (allCards.length > 0) {
      const sortedCards = sortCards(allCards, selectedSort);
      setCards(sortedCards);
    }
  }, [selectedSort]);
  const activeFields = defaultFields;
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("CardDetails", { card: item })}
      >
        <View style={[styles.card]}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              {activeFields.includes("name") && (
                <Text style={styles.name}>
                  {item.name?.trim()
                    ? item.name
                    : item.company?.trim()
                      ? item.company
                      : item.email}
                </Text>
              )}
              {/* Second Line */}
              {activeFields.includes("company_or_email") && (
                <Text style={styles.phone}>
                  {item.name?.trim()
                    ? item.company || item.email
                    : item.email}
                </Text>
              )}
              {activeFields.includes("phone") && (
                <Text style={styles.phone}>
                  {item.phone?.split("\n")[0]}
                </Text>
              )}
              {activeFields.includes("email") && (
                <Text style={styles.phone}>{item.email}</Text>
              )}
            </View>
            <View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <FlatList
          data={cards}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom || 20,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No cards saved yet!!</Text>
          }
        />
        {/* -------------------------sort by modal---------------------------- */}
        <Modal visible={sortVisible} transparent animationType="slide">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSortVisible(false)}
          >
            <View style={styles.sortModal}>
              <Text style={styles.modalTitle}>Sort By</Text>
              {[
                { key: "recent", label: "Recently Added" },
                { key: "az", label: "Name (A → Z)" },
                { key: "za", label: "Name (Z → A)" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.filterOption,
                    tempSort === item.key && styles.activeOption,
                  ]}
                  onPress={() => toggleSort(item.key)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      tempSort === item.key && styles.activeText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={[
                      styles.checkbox,
                      tempSort === item.key && styles.checkboxActive,
                    ]}
                  >
                    {tempSort === item.key && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setSelectedSort(tempSort);
                  setSortVisible(false);
                }}
              >
                <Text style={styles.applyText}>Apply Sort</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff5fd",
    borderRadius: 17,
    paddingHorizontal: 12,
    width: "100%",
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#3f3f3f",
    paddingVertical: 8,
    paddingRight: 8,
  },
  clearIcon: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e7ff",
    marginTop: -10,
    minHeight: 80,
    justifyContent: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1380c3",
  },
  phone: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 3,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
  filter: {
    position: "absolute",
    right: 10,
    top: 8,
    padding: 4,
  },
  sortModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 40,
    width: "100%",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#2563EB",
  },
  sortText: {
    fontSize: 16,
    color: "#353536",
    marginRight: 6,
  },
  sortIcon: {
    marginTop: 4,
    marginLeft: -4,
  },
  filterSortRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortButton: {
    flexDirection: "row",
    paddingHorizontal: 4,
    marginRight: 15,
    minHeight: 35,
    justifyContent: "flex-end",
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  filterModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  activeOption: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: -10,
  },
  filterText: {
    fontSize: 16,
    color: "#6691ed",
  },
  activeText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});