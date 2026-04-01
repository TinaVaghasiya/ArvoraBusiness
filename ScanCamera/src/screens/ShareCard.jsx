import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
import RNFS from 'react-native-fs';
import { BASE_API } from "../utils/api";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

export default function ShareCard({ route }) {
    console.log("ShareCard route params:", route.params);
    const navigation = useNavigation();
    const { card } = route.params;

    const [selected, setSelected] = useState({
        image: true,
        name: true,
        phone: true,
        email: true,
        company: true,
        designation: true,
        address: true,
        website: true,
        note: false,
    });

    const toggleField = (field) => {
        setSelected({ ...selected, [field]: !selected[field] });
    };

    const generateMessage = () => {
        let message = "";
        if (selected.name && card.name) message += `Name: ${card.name}\n\n`;
        if (selected.designation && card.designation)
            message += `Designation: ${card.designation}\n\n`;
        if (selected.company && card.company)
            message += `Company: ${card.company}\n\n`;
        if (selected.phone && card.phone)
            message += `Phone: \n${card.phone}\n\n`;
        if (selected.email && card.email)
            message += `Email: \n${card.email}\n\n`;
        if (selected.website && card.website)
            message += `Website: \n${card.website}\n\n`;
        if (selected.address && card.address)
            message += `Address: \n${card.address}\n\n`;
        if (selected.note && card.note)
            message += `Notes: ${card.note}\n\n`;

        return message;
    };
    console.log("Selected fields for sharing:", selected);

    const handleShare = async () => {
        const message = generateMessage();

        if (!message && !selected.image) {
            Alert.alert("Error", "Please select at least one field to share");
            return;
        }

        try {
            const shareOptions = {};

            if (selected.image && card.imageUrl) {
                const imageUrl = card.imageUrl.startsWith('/') ? card.imageUrl : `/${card.imageUrl}`;
                const fullImageUrl = `${BASE_API}${imageUrl}`;

                const fileName = `business_card_${Date.now()}.jpg`;
                const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

                console.log("Downloading image from:", fullImageUrl);
                console.log("Saving to:", localPath);

                const downloadResult = await RNFS.downloadFile({
                    fromUrl: fullImageUrl,
                    toFile: localPath,
                }).promise;

                if (downloadResult.statusCode === 200) {
                    shareOptions.url = `file://${localPath}`;
                    shareOptions.type = 'image/jpeg';

                    if (message) {
                        shareOptions.message = message;
                    }
                } else {
                    throw new Error("Failed to download image");
                }
            } else if (message) {
                shareOptions.message = message;
            }

            await Share.open(shareOptions);

            if (selected.image && card.imageUrl) {
                const fileName = `business_card_${Date.now()}.jpg`;
                const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
                setTimeout(() => {
                    RNFS.unlink(localPath).catch(() => { });
                }, 5000);
            }

        } catch (err) {
            console.log("Share error:", err);
        }
    };

    const renderDetailItem = (icon, label, value, field) => {
        if (!value) return null;

        return (
            <TouchableOpacity
                style={styles.detailItem}
                onPress={() => toggleField(field)}
                activeOpacity={0.7}
            >
                <View style={styles.detailLeft}>
                    <Icon name={icon} size={24} color="#666" style={styles.detailIcon} />
                    <View style={styles.detailText}>
                        <Text style={styles.detailLabel}>{label}</Text>
                        <Text style={styles.detailValue}>{value}</Text>
                    </View>
                </View>
                <View style={[styles.checkbox, selected[field] && styles.checkboxSelected]}>
                    {selected[field] && (
                        <Icon name="check" size={18} color="#fff" />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const imageUrl = card.imageUrl?.startsWith('/') ? card.imageUrl : `/${card.imageUrl}`;
    const fullImageUrl = `${BASE_API}${imageUrl}`;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24}  color="#1E3A8A"/>
                        </TouchableOpacity>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.title}>Share Business Card</Text>
                            <Text style={styles.subtitle}>Select the information you want to share</Text>
                        </View>
                    </View>
                </View>

                {/* Image Section */}
                {card.imageUrl && (
                    <View style={styles.imageSection}>
                        <View style={styles.imagecheckmark}>
                            <Text style={styles.sectionTitle}>Business Card Image</Text>
                            <TouchableOpacity
                                onPress={() => toggleField('image')}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.checkbox, selected.image && styles.imagecheckboxSelected]}>
                                    {selected.image && (
                                        <Icon name="check" size={16} color="#fff" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: fullImageUrl }}
                                style={styles.cardImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                )}

                {/* Details Section */}
                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Card Details</Text>
                    <View style={styles.detailsList}>
                        {renderDetailItem("person", "Name", card.name, "name")}
                        {renderDetailItem("work", "Designation", card.designation, "designation")}
                        {renderDetailItem("business", "Company", card.company, "company")}
                        {renderDetailItem("phone", "Phone", card.phone, "phone")}
                        {renderDetailItem("email", "Email", card.email, "email")}
                        {renderDetailItem("language", "Website", card.website, "website")}
                        {renderDetailItem("location-on", "Address", card.address, "address")}
                        {renderDetailItem("note", "Notes", card.note, "note")}
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                        <Icon name="share" size={24} color="#fff" style={styles.shareIcon} />
                        <Text style={styles.shareButtonText}>Share Items</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
        paddingHorizontal: 12,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        justifyContent: "flex-start",
        marginTop: 8,
    },
    title: {
        fontSize: 21,
        fontWeight: "700",
        color: "#1E3A8A",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#6c757d",
    },
    imageSection: {
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#212529",
        marginBottom: 12,
    },
    imageContainer: {
        alignItems: "center",
    },
    cardImage: {
        width: 320,
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    imagecheckmark: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,   
    },
    detailsSection: {
        backgroundColor: "#fff",
        margin: 16,
        marginTop: 0,
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailsList: {
        gap: 12,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    detailLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    detailIcon: {
        marginRight: 12,
    },
    detailText: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: "#6c757d",
        fontWeight: "500",
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        color: "#212529",
        fontWeight: "500",
    },
    checkbox: {
        width: 21,
        height: 21,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#dee2e6",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    imagecheckboxSelected: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        top: -4,
    },
    checkboxSelected: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
    },
    checkboxLabel: {
        fontSize: 16,
        color: "#212529",
        fontWeight: "500",
        marginLeft: 12,
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e9ecef",
    },
    shareButton: {
        backgroundColor: "#007bff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#007bff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    shareIcon: {
        marginRight: 8,
    },
    shareButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});