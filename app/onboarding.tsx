import { setOnboardingCompleted } from "@/utils/onboarding";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OnboardingScreen() {
  const handleGetStarted = async () => {
    // Mark onboarding as completed
    await setOnboardingCompleted();
    router.replace("/(routes)/login");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/onboarding/smartphone.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {/* Overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)"]}
        style={styles.overlay}
      />

      <View style={styles.contentContainer}>
        <Text
          style={styles.title}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
        >
          Welcome To Smart Wallet
        </Text>
        <Text
          style={styles.subtitle}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
        >
          Your money, smarter and safer.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <LinearGradient
            colors={["#5B3E96", "#2C2F7C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text
              style={styles.buttonText}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
            >
              Get Started
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
// const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  contentContainer: {
    flex: 1,
    position: "absolute",
    // justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
    width: "100%",
    zIndex: 2,
    bottom: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E2A78",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#1E2A78",
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.8,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
