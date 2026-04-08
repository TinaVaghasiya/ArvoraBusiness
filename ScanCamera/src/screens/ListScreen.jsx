import {
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
  Image,
  Keyboard,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { Dialog, Portal, Button } from "react-native-paper";
import {BASE_API, handleApiError} from "../utils/api";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const toggleSort = (key) => {
    setTempSort((prev) => (prev === key ? null : key));
  };
  const fetchCards = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found");
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
        return;
      }
      const response = await fetch(`${BASE_API}/api/cards/get-cards`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (await handleApiError(response, navigation)) return;
      
      const data = await response.json();
      console.log("📥 Cards from backend:", data);
      if (data.success){
        setAllCards(data.data);
      const sorted = sortCards(data.data, selectedSort);
      setCards(sorted);
      }
    } catch (error) {
      console.log("❌ Server Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: false,
      });
      fetchCards();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      fetchCards().then((data) => {
        const sorted = sortCards(data, selectedSort);
        setCards(sorted);
      });
    }, [selectedSort]),
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
          getSortableValue(a).localeCompare(getSortableValue(b)),
        );
      case "za":
        return sorted.sort((a, b) =>
          getSortableValue(b).localeCompare(getSortableValue(a)),
        );
      case "recent":
      default:
        return sorted;
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
      if (isMultiSelectMode) {
        setIsMultiSelectMode(false);
        setSelectedCards([]);
        return true;
      }
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
  }, [isSearching, isMultiSelectMode, allCards]);
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

  useEffect(() => {
    if (allCards.length > 0) {
      const sortedCards = sortCards(allCards, selectedSort);
      setCards(sortedCards);
    }
  }, [selectedSort]);
  const handleBulkDelete = () => {
    setDeleteConfirmVisible(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const deletePromises = selectedCards.map(async id => {
        const response = await fetch(`${BASE_API}/api/cards/delete-card/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        await handleApiError(response, navigation);
        return response;
      });
      
      await Promise.all(deletePromises);
      setDeleteConfirmVisible(false);
      setIsMultiSelectMode(false);
      setSelectedCards([]);
      fetchCards();
    } catch (error) {
      console.log("Error deleting cards:", error);
    }
  };

  const activeFields = defaultFields;
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (isMultiSelectMode) {
            if (selectedCards.includes(item._id)) {
              setSelectedCards(selectedCards.filter(id => id !== item._id));
            } else {
              setSelectedCards([...selectedCards, item._id]);
            }
          } else {
            navigation.navigate("CardDetails", { card: item });
          }
        }}
        onLongPress={() => {
          setIsMultiSelectMode(true);
          setSelectedCards([item._id]);
        }}
        delayLongPress={500}
      >
        <View style={[styles.card]}>
          <View style={styles.cardRow}>
            {isMultiSelectMode && (
              <View style={[styles.checkbox, selectedCards.includes(item._id) && styles.checkboxActive]}>
                {selectedCards.includes(item._id) && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
            )}
            <View style={{ flex: 1, marginLeft: isMultiSelectMode ? 12 : 0 }}>
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
                  {item.name?.trim() ? item.company || item.email : item.email}
                </Text>
              )}
              {activeFields.includes("phone") && (
                <Text style={styles.phone}>{item.phone?.split("\n")[0]}</Text>
              )}
              {activeFields.includes("email") && (
                <Text style={styles.phone}>{item.email}</Text>
              )}
            </View>
            {!isMultiSelectMode && (
              <View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6FA" }}>
      <LinearGradient
        colors={["#1E3A8A", "#1E3A8A"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              if (isSearching) {
                Keyboard.dismiss();
                setIsSearching(false);
                setSearch("");
                setCards(allCards);
              } else {
                navigation.goBack();
              }
            }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          {isSearching ? (
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
                    setSearch("");
                    setCards(allCards);
                  }}
                >
                  <Ionicons name="close" size={20} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text style={styles.headerTitle}>Business Cards</Text>
          )}

          <View style={styles.headerRight}>
            {isMultiSelectMode ? (
              <>
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={handleBulkDelete}
                  disabled={selectedCards.length === 0}
                >
                  <Ionicons name="trash" size={22} color={selectedCards.length > 0 ? "#fff" : "#888"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsMultiSelectMode(false);
                    setSelectedCards([]);
                  }}
                >
                  <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {!isSearching && (
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
              </>
            )}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.container}>
        {isMultiSelectMode && (
          <View style={styles.selectionBanner}>
            <Text style={styles.selectionText}>
              {selectedCards.length} selected
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (selectedCards.length === cards.length) {
                  setSelectedCards([]);
                } else {
                  setSelectedCards(cards.map(card => card._id));
                }
              }}
              style={styles.selectAllButton}
            >
              <View style={[styles.checkbox, selectedCards.length === cards.length && styles.checkboxActive]}>
                {selectedCards.length === cards.length && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.selectAllText}>Select All</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>
        )}
        <FlatList
          data={cards}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: isMultiSelectMode ? 4 : 12,
            paddingBottom: 20,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: "center", marginTop: 60 ,alignItems: "center" }}>
            <Image 
              style={{ width: 190, height: 190 }}
              source={require("../../assets/noFound.png")} />
            <Text style={styles.empty}>No card found !!</Text></View>
          }
        />
        <Portal>
          <Dialog
            visible={deleteConfirmVisible}
            onDismiss={() => setDeleteConfirmVisible(false)}
          >
            <Dialog.Title>Delete cards</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: "#6B7280" }}>
                Are you sure you want to delete {selectedCards.length} card{selectedCards.length > 1 ? 's' : ''}?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteConfirmVisible(false)}>
                Cancel
              </Button>
              <Button onPress={confirmBulkDelete} color="#f15a5a">
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff5fd",
    borderRadius: 17,
    paddingHorizontal: 12,
    marginLeft: 10,
    marginRight: 10,
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
    marginTop: 10,
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
    width: 18,
    height: 18,
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
  selectionBanner: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: "#F4F6FA",
  },
  selectionText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "400",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e7ff",
    marginTop: 8,
  },
  selectAllButton: {
    position: "absolute",
    right: 18,
    top: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectAllText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "400",
  },
});
