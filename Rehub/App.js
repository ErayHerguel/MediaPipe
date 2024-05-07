import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="dashboard" size={25} color="#ffffff" />
          <Text style={styles.appBarText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="fitness-center" size={25} color="#ffffff" />
          <Text style={styles.appBarText}>Übungen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bar-chart" size={25} color="#ffffff" />
          <Text style={styles.appBarText}>Statistiken</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="settings" size={25} color="#ffffff" />
          <Text style={styles.appBarText}>Einstellungen</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.welcomeMessage}>Hallo Eray!</Text>
      <View style={styles.dashboard}>
        <View style={styles.box}>
          <Text>Nächste Übung</Text>
        </View>
        <View style={styles.box}>
          <Text>Kasten 2</Text>
        </View>
        <View style={styles.box}>
          <Text>Kasten 3</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8",
  },
  appBar: {
    backgroundColor: "#6200ee",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  appBarText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  welcomeMessage: {
    fontSize: 18,
    margin: 20,
    textAlign: "center",
  },
  dashboard: {
    flex: 1,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
  },
});
