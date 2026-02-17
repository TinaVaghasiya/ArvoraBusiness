import { use, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";


export default function ListScreen() {
    const defaultFields = ["name", "phone", "company_or_email"];
    const navigation = useNavigation();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [allCards, setAllCards] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [sortVisible, setSortVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState("recent");
    const insets = useSafeAreaInsets();
    // const toggleFilter = (filter) => {
    //     setSelectedFilters(prev =>
    //         prev.includes(filter)
    //             ? prev.filter(f => f !== filter)
    //             : [...prev, filter]
    //     );
    // };
    const toggleSort = (key) => {
        setSelectedSort(prev =>
            prev === key ? null : key
        );
    };


    // const fetchCards = async () => {
    //     try {
    //         const response = await fetch(
    //             "http://192.168.29.89:5000/api/cards/get-cards"
    //         );

    //         const data = await response.json();

    //         if (data.success) {
    //             setCards(data.data);
    //         } else {
    //             console.log("Failed to fetch cards");
    //         }
    //     } catch (error) {
    //         console.log("Server Error:", error);
    //     } finally {
    //         setLoading(false);
    //         setRefreshing(false);
    //     }
    // };

    const fetchCards = () => {
        try {
            const dummyCards = [
                {
                    _id: "1",
                    name: "John Doe",
                    company: "Tech Corp",
                    email: "john@techcorp.com",
                    phone: "+1234567890",
                    note: "Met at conference. And developed a great rapport. Interested in our product and wants to explore partnership opportunities. Follow up next week to discuss potential collaboration and next steps."
                },
                {
                    _id: "2",
                    name: "Jane Smith",
                    company: "Design Studio",
                    email: "jane@design.com",
                    phone: "+0987654321"
                },
                {
                    _id: "3",
                    name: "Caroline Channing",
                    // company: "Infosys",
                    email: "caroline@infosys.com",
                    phone: "+9199999999",
                },
                {
                    _id: "4",
                    name: "Aisha Khan",
                    company: "Creative Solutions",
                    email: "aisha@creativesolutions.com",
                    phone: "+9188888888"
                },
                {
                    _id: "5",
                    name: "James Wilson",
                    company: "Global Inc",
                    email: "james@globalinc.com",
                    phone: "+1122334455",
                    note: "Follow up needed"
                },
                {
                    _id: "6",
                    name: "Priya Sharma",
                    company: "Digital World",
                    email: "priya@digitalworld.com",
                    phone: "+9177777777",
                    note: "Project collaboration"
                },
                {
                    _id: "7",
                    name: "Carlos Mendez",
                    company: "Innovatech",
                    email: "carlos@innovatech.com",
                    phone: "+1555666777"
                }
            ];
            setAllCards(dummyCards);
            setCards(dummyCards);
            setLoading(false);
            setRefreshing(false);
            return;
        } catch (error) {
            console.log("Server Error:", error);
            setLoading(false);
            setRefreshing(false);
        }
    };
    useEffect(() => {
        // setLoading(true);
        fetchCards();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCards();
    };

    const handleSearch = (text) => {
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
    };

    const sortCards = (cardsToSort, sortType) => {
        const sorted = [...cardsToSort];
        switch (sortType) {
            case 'az':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'za':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'recent':
            default:
                return sorted.reverse();
        }
    };
    // useEffect(() => {
    //     const sortedCards = sortCards(cards, selectedSort);
    //     setCards(sortedCards);
    // }, [selectedSort]);

    useEffect(() => {
    if (cards.length > 0) {
        const sortedCards = sortCards(cards, selectedSort);
        setCards(sortedCards);
    }
}, [selectedSort]);


    const activeFields = defaultFields;

    const renderItem = ({ item }) => {

        // const isFiltered = selectedFilters.length > 0;
        // const fieldCount = selectedFilters.length;
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("CardDetails", { card: item })} >
            <View
                style={[
                    styles.card,
                ]}
            >
                <View style={styles.cardRow}>
                    <View style={{ flex: 1 }}>

                        {activeFields.includes("name") && (
                            <Text style={styles.name}>
                                {item.name}
                            </Text>
                        )}

                        {activeFields.includes("company_or_email") && (
                            <Text
                                style={
                                 styles.phone}
                            >
                                {item.company || item.email}
                            </Text>
                        )}

                        {activeFields.includes("phone") && (
                            <Text
                                style={styles.phone}
                            >
                                {item.phone}
                            </Text>
                        )}

                        {activeFields.includes("email") && (
                            <Text
                                style={styles.phone}
                            >
                                {item.email}
                            </Text>
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


    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <View style={styles.search}>

                    {/* <TouchableOpacity onPress={() => { setSearch(""); handleSearch("") }}>
                    <Ionicons name="close-outline" size={24} color="#787e8b" style={{ position: "absolute", top: 10, right: 45 }} />
                </TouchableOpacity> */}
                    <TouchableOpacity>
                        <Ionicons name="search" size={26} color="#3e3e3e" style={{ position: "absolute", top: 10, left: 1 }} />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Search.."
                        placeholderTextColor="#62656a"
                        style={styles.searchText}
                        value={search}
                        onChangeText={handleSearch}
                    />
                    {/* <TouchableOpacity onPress={() => { setFilterVisible(true); setSortVisible(false); }} style={styles.filter}>
                        <Ionicons name="options-outline" size={28} color="#327bb0" />
                        {selectedFilters.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {selectedFilters.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity> */}
                </View>
            </View >


            <TouchableOpacity
                style={styles.sortButton}
                onPress={() => { setSortVisible(true) }}>
                <Text style={styles.sortText}>Sort by</Text>
                <Ionicons name="chevron-down" size={16} color="#353536" style={styles.sortIcon} />
            </TouchableOpacity>


            < FlatList
                data={cards}
                keyExtractor={(item) => item._id
                }
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: insets.bottom || 20 }}
                refreshControl={
                    < RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    < Text style={styles.empty} >
                        No cards saved yet!!
                    </Text >
                }
            />

            {/* ---------------------------Fiter Modal=-------------------------- */}

            {/* < Modal
                visible={filterVisible}
                transparent
                animationType="slide"
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setFilterVisible(false)}
                >

                    <View style={styles.filterModal}>

                        <Text style={styles.modalTitle}>Filter By</Text>

                        {["name", "company", "email", "phone"].map(type => (

                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.filterOption,
                                    selectedFilters.includes(type) && styles.activeOption
                                ]}
                                onPress={() => toggleFilter(type)}
                            >

                                <Text
                                    style={[
                                        styles.filterText,
                                        selectedFilters.includes(type) && styles.activeText
                                    ]}
                                >
                                    {type.toString()}
                                </Text>

                                {selectedFilters.includes(type) && (
                                    <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
                                )}

                            </TouchableOpacity>

                        ))}

                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => setFilterVisible(false)}
                        >
                            <Text style={styles.applyText}>Apply Filters</Text>
                        </TouchableOpacity>

                    </View>

                </TouchableOpacity>
            </Modal> */}

                    {/* -------------------------sort by modal---------------------------- */}

            <Modal
                visible={sortVisible}
                transparent
                animationType="slide"
            >
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
                        ].map(item => (

                            <TouchableOpacity
                                key={item.key}
                                style={[
                                    styles.filterOption,
                                    selectedSort === item.key && styles.activeOption
                                ]}
                                onPress={() => toggleSort(item.key)}
                            >

                                <Text
                                    style={[
                                        styles.filterText,
                                        selectedSort === item.key && styles.activeText
                                    ]}
                                >
                                    {item.label}
                                </Text>

                                <View
                                    style={[
                                        styles.checkbox,
                                        selectedSort === item.key && styles.checkboxActive
                                    ]}
                                >
                                    {selectedSort === item.key && (
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    )}
                                </View>

                            </TouchableOpacity>

                        ))}

                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => setSortVisible(false)}
                        >
                            <Text style={styles.applyText}>Apply Sort</Text>
                        </TouchableOpacity>

                    </View>

                </TouchableOpacity>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 10,
        paddingTop: 6,
        paddingBottom: 0,
    },
    oneFieldCard: {
        minHeight: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    oneFieldText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#475569",
        letterSpacing: 0.3,
        textAlign: "left"
    },
    twoFieldCard: {
        paddingVertical: 12
    },
    twoFieldText: {
        fontSize: 17,
        color: "#475569",
        marginTop: 12,
    },
    filteredName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2563EB",
        marginTop: 4,
        marginBottom: -4,
    },
    
    filteredText: {
        fontSize: 24,
        color: "#1E3A8A",
        fontWeight: "500",
        marginTop: 4,
    },
    searchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    search: {
        flexDirection: "row",
        marginTop: 6,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingVertical: 4,
        fontSize: 16,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        width: "100%",
    },
    searchText: {
        flex: 1,
        paddingLeft: 40,
        fontSize: 18,
        color: "#111827",
        paddingRight: 35,
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
        marginTop: -16,
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
    note: {
        marginTop: 12,
        fontSize: 14,
        color: "#2563EB",
        fontStyle: "italic",
        backgroundColor: "#eff6ff",
        padding: 8,
        borderRadius: 8,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    badge: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "#456ae4",
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "bold",
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
        borderRadius: 10,
        paddingHorizontal: 10,
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
