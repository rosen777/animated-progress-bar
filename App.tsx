import { StatusBar } from 'expo-status-bar';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useRef, useState, useEffect } from "react";

type Progress = {
  step: number;
  steps: number;
  height: number;
}

const Progress = ({ step, steps, height }: Progress) => {
  // 1000 moves it outside of the screen before getting the container's width
  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(-1000)).current;
  const reactive = useRef(new Animated.Value(-1000)).current;
  // Animated, the animated value based on the reactive value
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    reactive.setValue(-width + (width * step) / steps);
  }, [step, width]);

  return (
    <>
      <Text style={styles.stepsText}>
        ${step}/${steps}
      </Text>
      <View
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;
          setWidth(newWidth);
        }}
        style={{ 
          height, 
          borderRadius: height,
          overflow: 'hidden'
        }}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              height,
              borderRadius: height,
              transform: [
                {
                  translateX: animatedValue,
                },
              ],
            },
          ]}
        />
      </View>
    </>
  );
};

export default function App() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % (10 + 1));
    }, 500)

    return () => {
      clearInterval(interval);
    }
  }, [index]);

  return (
    <View style={styles.container}>
      {/* <StatusBar hidden /> */}
      <Progress step={index} steps={10} height={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  progressContainer: {
    backgroundColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  progressView: {
    width: "100%",
  },
  stepsText: {
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    backgroundColor: "rgba(0,0,0,0.5)",
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
