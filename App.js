import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    setLoading(true);
    setError("");
    setWeather(null);
    setHourlyWeather([]);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setError("Brak zgody na pobranie lokalizacji.");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      setLocation({
        latitude: latitude,
        longitude: longitude,
      });

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,precipitation&hourly=temperature_2m,precipitation_probability,wind_speed_10m&forecast_days=2`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Błąd pobierania pogody");
      }

      const data = await response.json();

      setWeather(data.current);

      const hours = data.hourly.time.slice(0, 24).map((time, index) => {
        return {
          id: index.toString(),
          time: time,
          temperature: data.hourly.temperature_2m[index],
          rain: data.hourly.precipitation_probability[index],
          wind: data.hourly.wind_speed_10m[index],
        };
      });

      setHourlyWeather(hours);
    } catch (err) {
      setError("Nie udało się pobrać danych pogodowych.");
    } finally {
      setLoading(false);
    }
  };

  const renderHour = ({ item }) => {
    return (
      <View style={styles.hourCard}>
        <Text style={styles.hourTime}>{item.time.replace("T", " ")}</Text>
        <Text>Temperatura: {item.temperature}°C</Text>
        <Text>Opady: {item.rain}%</Text>
        <Text>Wiatr: {item.wind} km/h</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Pogoda tu i teraz</Text>
        <Text style={styles.description}>
          Aplikacja pobiera lokalizację telefonu i pokazuje aktualną pogodę.
        </Text>

        <Pressable style={styles.button} onPress={getWeather}>
          <Text style={styles.buttonText}>Pobierz pogodę</Text>
        </Pressable>

        {loading && <Text style={styles.info}>Ładowanie danych...</Text>}

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        {location && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lokalizacja</Text>
            <Text>Szerokość: {location.latitude.toFixed(4)}</Text>
            <Text>Długość: {location.longitude.toFixed(4)}</Text>
          </View>
        )}

        {weather && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Aktualna pogoda</Text>
            <Text>Temperatura: {weather.temperature_2m}°C</Text>
            <Text>Wiatr: {weather.wind_speed_10m} km/h</Text>
            <Text>Opad: {weather.precipitation} mm</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Prognoza godzinowa</Text>

        {!loading && hourlyWeather.length === 0 && error === "" && (
          <Text style={styles.info}>Brak danych do wyświetlenia.</Text>
        )}

        <FlatList
          data={hourlyWeather}
          keyExtractor={(item) => item.id}
          renderItem={renderHour}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f2f4f8",
  },
  container: {
    flex: 1,
    padding: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 13,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  info: {
    color: "#4b5563",
    marginBottom: 10,
  },
  error: {
    color: "#dc2626",
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 6,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 6,
    marginBottom: 8,
  },
  hourCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  hourTime: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2563eb",
  },
});
