import { useLayoutEffect, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ListScreen() {
    const defaultFields = ["name", "phone", "company_or_email"];
    const navigation = useNavigation();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [allCards, setAllCards] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [sortVisible, setSortVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState("recent");
    const [tempSort, setTempSort] = useState("recent");
    const insets = useSafeAreaInsets();
    const toggleSort = (key) => {
        setTempSort(prev =>
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

    useLayoutEffect(() => {
        {/* header logic */ }
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
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor="#928e8e"
                        autoFocus
                        value={search}
                        onChangeText={handleSearch}
                        style={styles.searchInput}
                    />
                )
                : "Business Cards",

            headerRight: () => (
                <View style={styles.headerRight}>

                    {isSearching ? (
                        <TouchableOpacity
                            style={{ marginRight: 20 }}
                            onPress={() => setIsSearching(false)}
                        >
                            <Ionicons name="close" size={22} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{ marginRight: 20 }}
                            onPress={() => setIsSearching(true)}
                        >
                            <Ionicons name="search" size={22} color="#fff" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => {
                        setTempSort(selectedSort);
                        setSortVisible(true);
                    }}>
                        <Ionicons name="swap-vertical" size={22} color="#fff" />
                    </TouchableOpacity>

                </View>
            ),
        });
    }, [navigation, isSearching, handleSearch]);


    useEffect(() => {
        if (cards.length > 0) {
            const sortedCards = sortCards(cards, selectedSort);
            setCards(sortedCards);
        }
    }, [selectedSort]);


    const activeFields = defaultFields;

    const renderItem = ({ item }) => {
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

    return (
        <View style={styles.container}>

            {/* <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                {!isSearching ? (
                    <Text style={styles.headerTitle}>Business Cards</Text>
                ) : (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor="#5e5c5c"
                        autoFocus
                        value={search}
                        onChangeText={handleSearch}
                    />
                )}

                <View style={styles.headerRight}>

                    {!isSearching && (
                        <TouchableOpacity
                            style={{ marginRight: 18 }}
                            onPress={() => setIsSearching(true)}
                        >
                            <Ionicons name="search" size={22} color="#fff" />
                        </TouchableOpacity>
                    )}

                    {isSearching && (
                        <TouchableOpacity
                            style={{ marginRight: 18 }}
                            onPress={() => setIsSearching(false)}
                        >
                            <Ionicons name="close" size={22} color="#fff" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => { 
                        setTempSort(selectedSort);
                        setSortVisible(true); }}>
                        <Ionicons name="swap-vertical" size={22} color="#fff" />
                    </TouchableOpacity>
                    </View>
                </View> */}

            < FlatList
                data={cards}
                keyExtractor={(item) => item._id
                }
                renderItem={renderItem}
                contentContainerStyle={{ paddingTop: 12, paddingBottom: insets.bottom || 20 }}
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
                                    tempSort === item.key && styles.activeOption
                                ]}
                                onPress={() => toggleSort(item.key)}
                            >

                                <Text
                                    style={[
                                        styles.filterText,
                                        tempSort === item.key && styles.activeText
                                    ]}
                                >
                                    {item.label}
                                </Text>

                                <View
                                    style={[
                                        styles.checkbox,
                                        tempSort === item.key && styles.checkboxActive
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
                                setSortVisible(false)
                            }}
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
        backgroundColor: "#F4F6FA",
    },
    // header: {
    //     height: 95,
    //     backgroundColor: "#618af0",
    //     paddingTop: 45,
    //     paddingHorizontal: 16,
    //     flexDirection: "row",
    //     alignItems: "center",
    // },

    // headerTitle: {
    //     flex: 1,
    //     color: "#fff",
    //     fontSize: 20,
    //     fontWeight: "600",
    //     marginLeft: 15,
    // },

    searchInput: {
        flex: 1,
        color: "#3f3f3f",
        fontSize: 16,
        marginLeft: -20,
        backgroundColor: "#eff5fd",
        borderRadius: 17,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 16,
        marginBottom: 2,
        width: 245,
        shadowOffset:{ width: 0, height: 4 },
        shadowColor: "#000"
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
