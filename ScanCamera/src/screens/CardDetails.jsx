import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { Menu, IconButton, Dialog, Portal, Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function CardDetails({ route }) {
  const card = route?.params?.card;
  const navigation = useNavigation();
  const handleCall = () => Linking.openURL(`tel:${card.phone}`);
  const handleEmail = () => Linking.openURL(`mailto:${card.email}`);
  const handleWebsite = () =>
    Linking.openURL(`https://${card.website}`);

  const [note, setNote] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [tempNote, setTempNote] = useState("");

  const openDialog = () => {
    setTempNote("");
    setDialogVisible(true);
  };

  const handleAddNote = () => {
    setNote(tempNote);
    setDialogVisible(false);
  };

  const handleDeleteNote = () => {
    setNote(null);
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={[styles.nameheader,
              !card.company && { paddingBottom: 22 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton,!card.company && {marginTop:8}]}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[
              styles.name,!card.company && {marginTop: 8}]}>{card.name}</Text>
            {card.company && <Text style={styles.title}>{card.company}</Text>}
          </View>
        </View>



        {/* Identity Section
        <View style={styles.identityContainer}>
          
          <MaterialCommunityIcons name="office-building-outline" size={22} color="#2563EB" />
          
        </View> */}

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
            {card?.note ? (
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
                    setTempNote(note);
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
            {card.note ? card.note : "No notes yet."}
          </Text>

          <Portal>{/* use for note editing pop up*/}
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={{ backgroundColor: "#fbfbfc" }}>
              <Dialog.Title>{card.note ? "Edit Note" : "Add Note"}</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  mode="outlined"
                  label="Your Note"
                  value={tempNote}
                  onChangeText={setTempNote}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ backgroundColor: "#f5f6f9" }}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                <Button onPress={handleAddNote}>Save</Button>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    padding: 4,
    justifyContent: "flex-start"
  },

  headerTextContainer: {
    marginLeft: 15,
    marginLeft: 12
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
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

});

