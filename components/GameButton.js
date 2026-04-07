import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../theme';

const GameButton = ({ title, onPress, color = COLORS.success }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      {/* The Shadow/Bottom Layer */}
      <View style={[styles.shadow, { backgroundColor: color, opacity: 0.5 }]} />
      {/* The Main Button Layer */}
      <View style={[styles.button, { backgroundColor: color }]}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
    height: 60,
  },
  button: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  shadow: {
    height: 55,
    borderRadius: 15,
    position: 'absolute',
    top: 5, // Offset for the 3D look
    left: 0,
    right: 0,
    zIndex: 1,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default GameButton;