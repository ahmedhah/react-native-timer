import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Picker,
  Platform,
} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#FF851B",
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
  timerText: {
    color: "#fff",
    fontSize: 90,
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
        marginLeft: 10,
      },
    }),
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

// 3 => 03, 10 => 10
const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }

  return arr;
};

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

const Pickers = ({
  selectedMinutes,
  setSelectedMinutes,
  selectedSeconds,
  setSelectedSeconds,
}) => (
  <View style={styles.pickerContainer}>
    <Picker
      style={styles.picker}
      itemStyle={styles.pickerItem}
      selectedValue={selectedMinutes}
      onValueChange={(itemValue) => {
        setSelectedMinutes(itemValue);
      }}
      mode="dropdown"
    >
      {AVAILABLE_MINUTES.map((value) => (
        <Picker.Item key={value} label={value} value={value} />
      ))}
    </Picker>
    <Text style={styles.pickerItem}>minutes</Text>
    <Picker
      style={styles.picker}
      itemStyle={styles.pickerItem}
      selectedValue={selectedSeconds}
      onValueChange={(itemValue) => {
        setSelectedSeconds(itemValue);
      }}
      mode="dropdown"
    >
      {AVAILABLE_SECONDS.map((value) => (
        <Picker.Item key={value} label={value} value={value} />
      ))}
    </Picker>
    <Text style={styles.pickerItem}>seconds</Text>
  </View>
);

export default () => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [remainingSeconds, setRemainingSeconds] = React.useState(5);
  const [selectedMinutes, setSelectedMinutes] = React.useState("0");
  const [selectedSeconds, setSelectedSeconds] = React.useState("5");

  const { minutes, seconds } = getRemaining(remainingSeconds);

  const start = () => {
    setRemainingSeconds(
      parseInt(selectedMinutes, 10) * 60 + parseInt(selectedSeconds, 10)
    );
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  React.useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setRemainingSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      interval = null;
      setIsRunning(false);
      setRemainingSeconds(5);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, remainingSeconds]);

  React.useEffect(() => {
    if (remainingSeconds === 0) {
      stop();
    }
  }, [remainingSeconds]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isRunning ? (
        <>
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
          <TouchableOpacity
            onPress={stop}
            style={[styles.button, styles.buttonStop]}
          >
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Pickers
            selectedMinutes={selectedMinutes}
            setSelectedMinutes={setSelectedMinutes}
            selectedSeconds={selectedSeconds}
            setSelectedSeconds={setSelectedSeconds}
          />
          <TouchableOpacity onPress={start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
