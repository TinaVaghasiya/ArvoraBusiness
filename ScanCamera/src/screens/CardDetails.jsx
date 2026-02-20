import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { Menu, IconButton, Dialog, Portal, Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import "../utils/api";

export default function CardDetails({ route }) {
  const card = route?.params?.card;
  const navigation = useNavigation();
  const handleCall = () => Linking.openURL(`tel:${card.phone}`);
  const handleEmail = () => Linking.openURL(`mailto:${card.email}`);
  const handleWebsite = () =>
    Linking.openURL(`https://${card.website}`);

  // const [note, setNote] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuHeaderVisible, setMenuHeaderVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [tempNote, setTempNote] = useState("");
  const [currentNote, setCurrentNote] = useState(card.note || "");


  const openDialog = () => {
    setTempNote("");
    setDialogVisible(true);
  };

  const handleAddNote = async () => {
  try {
    const response = await fetch(
      `${BASE_API}/api/cards/update-card/${card._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: tempNote }),
      }
    );
    const data = await response.json();
    if (data.success) {
      card.note = tempNote;
      setCurrentNote(tempNote);
      setDialogVisible(false);
    }
  } catch (error) {
    console.log("Error updating note:", error);
  }
};

const handleDeleteNote = async () => {
  try {
    const response = await fetch(
      `http://192.168.1.8:5000/api/cards/update-card/${card._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "" }),
      }
    );
    const data = await response.json();
    if (data.success) {
      setCurrentNote("");
      setMenuVisible(false);
    }
  } catch (error) {
    console.log("Error deleting note:", error);
  }
};

const handleDeleteCard = async () => {
  try {
    const response = await fetch(
      `${BASE_API}/api/cards/delete-card/${card._id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.success) {
      setDeleteConfirmVisible(false);
      setMenuHeaderVisible(false);
      navigation.goBack();
    }
  } catch (error) {
    console.log("Error deleting card:", error);
  }
};


  return (
    <View style={styles.container}>
      <View style={[styles.nameheader, !card.company && { paddingBottom: 22 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backButton, !card.company && { marginTop: 8 }]}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.name, !card.company && { marginTop: 8 }]}>{card.name}</Text>
              {card.company && <Text style={styles.title}>{card.company}</Text>}
            </View>
          </View>

          <Menu
            visible={menuHeaderVisible}
            onDismiss={() => setMenuHeaderVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={26}
                iconColor="#ffffff"
                onPress={() => setMenuHeaderVisible(true)}
                style={{ marginRight: 0, marginTop: 14 }}
              />
            }
            contentStyle={{ backgroundColor: "#fafdff", marginTop: 35, marginLeft: 14, paddingHorizontal: 0, paddingVertical: 0 }}
          >
            <Menu.Item
              onPress={() => {
                setMenuHeaderVisible(false);
                setDeleteConfirmVisible(true);
              }}
              title="Delete"
              titleStyle={{ color: "#f15a5a" }}
            />
          </Menu>
        </View>
        
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {card?.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: card.imageUrl }}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>
        ) : null}

        {/* Contact Info Card */}
        <View style={[styles.card, !card.company && { marginTop: 22 }]}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Mobile</Text>
              <Text style={styles.value}>
                {card.phone}
              </Text>
            </View>
            <Ionicons name="call" size={20} color="#2563EB" style={{ marginRight: 0, backgroundColor: "#e6edf7", borderRadius: 55, width: 35, height: 35, padding: 8, marginTop: 5 }} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.infoRow} onPress={handleEmail}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value} >
                {card.email}
              </Text>
            </View>
            <Ionicons name="mail" size={20} color="#2563EB" style={{ marginRight: 0, backgroundColor: "#e6edf7", borderRadius: 55, width: 35, height: 35, padding: 8, marginTop: 5 }} />
          </TouchableOpacity>
          {/* <View style={styles.infoBlock}>
            <Text style={styles.label}>Website</Text>
            <Text style={styles.value} onPress={handleWebsite}>
              {card.website}
            </Text>
          </View> */}
        </View>

        {/* Notes Card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.sectionTitle}>Notes</Text>
            {currentNote ? (
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                contentStyle={{ backgroundColor: "#eaeaeb", marginTop: 30, paddingVertical: 0 }}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={22}
                    onPress={() => setMenuVisible(true)}
                    style={{ marginRight: 0, marginTop: -5 }}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    setTempNote(currentNote);
                    setDialogVisible(true);
                    setMenuVisible(false);
                  }}
                  title="Edit"
                  titleStyle={{ marginTop: 8 }}
                />
                <Menu.Item
                  onPress={handleDeleteNote}
                  title="Delete"
                  titleStyle={{ color: "#f15a5a", marginBottom: 8 }}
                />
              </Menu>
            ) : (
              <IconButton
                icon="plus"
                size={22}
                onPress={openDialog}
                style={{ marginRight: 0, marginTop: -5 }}
              />
            )}
          </View>

          <Text style={styles.notesText}>
            {currentNote ? currentNote : "No notes yet."}
          </Text>

          <Portal>{/* use for note editing pop up*/}
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={{ backgroundColor: "#fbfbfc" }}>
              <Dialog.Title>{currentNote ? "Edit Note" : "Add Note"}</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  mode="outlined"
                  label="Your Note"
                  defaultValue={tempNote}
                  onChangeText={setTempNote}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  autoFocus
                  style={{ backgroundColor: "#f5f6f9" }}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                <Button onPress={handleAddNote}>Save</Button>
              </Dialog.Actions>
            </Dialog>
            <Dialog visible={deleteConfirmVisible} onDismiss={() => setDeleteConfirmVisible(false)}>
              <Dialog.Title>Delete card</Dialog.Title>
              <Dialog.Content>
                <Text style={{ color: "#6B7280" }}>Are you sure you want to delete this card?</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDeleteConfirmVisible(false)}>Cancel</Button>
                <Button onPress={handleDeleteCard} color="#f15a5a">Delete</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  nameheader: {
    backgroundColor: "#618af0",
    paddingTop: 28,
    paddingBottom: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    padding: 4,
    justifyContent: "flex-start",
    marginTop: 14
  },

  headerTextContainer: {
    marginLeft: 15,
    marginLeft: 12
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 12,
  },

  title: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 22,
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1E1E1E",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  infoBlock: {
    marginBottom: 12,
    flex: 1,
  },

  label: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    color: "#2563EB",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  notesText: {
    fontSize: 15,
    color: "#6B7280",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },

  primaryButton: {
    backgroundColor: "#4F6DFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 18,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: 220,
  },

});