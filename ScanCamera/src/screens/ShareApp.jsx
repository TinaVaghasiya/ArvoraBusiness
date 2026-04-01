import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Share from "react-native-share";
import * as Clipboard from '@react-native-clipboard/clipboard';
import { Linking } from 'react-native';

export default function ShareApp() {
    const navigation = useNavigation();

    const appLink = "https://drive.google.com/file/d/1jGwTdPaembbyETfZfSnlUjh6pcEG2JGJ/view?usp=sharing";

    const generateMessage = () => {
        return `✨ Scan. Save. Share.\n\nArvora Business helps you scan business cards instantly, save contacts, and organize your professional network with ease.\n\n📲 Try it now:\n${appLink}`;
    };

    const handleShare = async () => {
        try {
            await Share.open({ message: generateMessage() });
        } catch (error) {
            console.log("Error sharing:", error);
        }
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(appLink);
    };

const handleWhatsAppShare = async () => {
    const message = generateMessage();
    
    try {
        const shareOptions = {
            title: 'Arvora Business App',
            message: message,
            social: Share.Social.WHATSAPP,
        };
        
        await Share.shareSingle(shareOptions);
        
    } catch (error) {
        console.log("WhatsApp share error:", error);
        
        // Check if it's a "not installed" error
        if (error.message && error.message.toLowerCase().includes('not installed')) {
            Alert.alert(
                "WhatsApp not installed",
                "Please install WhatsApp to use this feature",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Install", onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.whatsapp') }
                ]
            );
        } else {
            // Some other error, fallback to generic share
            handleShare();
        }
    }
};

// const handleMessagesShare = async () => {
//     const message = generateMessage();
    
//     try {
//         const shareOptions = {
//             title: 'Arvora Business App',
//             message: message,
//             social: Share.Social.SMS,
//         };
        
//         await Share.shareSingle(shareOptions);
        
//     } catch (error) {
//         console.log("SMS share error:", error);
//         // Fallback to generic share
//         handleShare();
//     }
// };


const handleMessagesShare = async () => {
    const message = generateMessage();

    try {
        const smsUrls = [
            `sms:?body=${encodeURIComponent(message)}`,
            `sms:&body=${encodeURIComponent(message)}`,
            `android.intent.action.SENDTO`
        ];

        let opened = false;
        for (const url of smsUrls) {
            try {
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                    await Linking.openURL(url);
                    opened = true;
                    break;
                }
            } catch (error) {
                console.log(`Failed to open ${url}:`, error);
            }
        }

        if (!opened) {
            Alert.alert("Error", "SMS not available on this device");
        }
    } catch (error) {
        console.log("SMS share error:", error);
        Alert.alert("Error", "Failed to open Messages");
    }
};


const handleCopyLink = () => {
    const message = generateMessage();
    Clipboard.setString(message);
};

// const handleCopyLink = async () => {
//         await Clipboard.setStringAsync(appLink);
//     };

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color="#1E3A8A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Share App</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Illustration */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require("../../assets/sharee.png")}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Scannable Benefits Section */}
                <View style={styles.benefitsContainer}>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={22} color="#1E3A8A" />
                        <Text style={styles.benefitText}><Text style={styles.bold}>Instantly Scan</Text> Business Cards</Text>
                    </View>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={22} color="#1E3A8A" />
                        <Text style={styles.benefitText}><Text style={styles.bold}>Easily Save</Text> & Organize Contacts</Text>
                    </View>
                    <View style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle" size={22} color="#1E3A8A" />
                        <Text style={styles.benefitText}><Text style={styles.bold}>Never Lose</Text> a Connection</Text>
                    </View>
                </View>

                <Text style={styles.thankYouText}>
                    Thankyou for choosing Arvora Business!💙
                </Text>

                {/* Primary Action */}
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Ionicons name="share-social" size={22} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.shareButtonText}>Share App</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* Quick Actions Grid */}
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.actionItem} onPress={handleCopyLink}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E0E7FF' }]}>
                            <Ionicons name="link" size={24} color="#1E3A8A" />
                        </View>
                        <Text style={styles.actionLabel}>Copy Link</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={handleWhatsAppShare}>
                        <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                            <FontAwesome name="whatsapp" size={24} color="#16A34A" />
                        </View>
                        <Text style={styles.actionLabel}>WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={handleMessagesShare}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                            <MaterialCommunityIcons name="message-text" size={24} color="#D97706" />
                        </View>
                        <Text style={styles.actionLabel}>Messages</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1E3A8A",
        marginLeft: 16,
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    imageContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    image: {
        width: '100%',
        height: 220,
    },
    benefitsContainer: {
        marginVertical: 20,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    benefitText: {
        fontSize: 16,
        color: "#4B5563",
        marginLeft: 10,
    },
    bold: {
        fontWeight: '700',
        color: '#1E3A8A'
    },
    thankYouText: {
        fontSize: 15,
        fontStyle: 'normal',
        color: '#6B7280',
        textAlign: 'left',
        marginBottom: 30,
    },
    shareButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1E3A8A",
        paddingVertical: 16,
        borderRadius: 14,
        shadowColor: "#1E3A8A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    shareButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 30,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionItem: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
    }
});