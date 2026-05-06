import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { COLORS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const TeacherStudents = ({ navigation }) => {
  const [students, setStudents] = useState([
    { id: '1', name: 'Angel Anne Garcia', level: 5, xp: 320, status: 'Active Reader' },
    { id: '2', name: 'Shaine Roxanne Eceja', level: 4, xp: 210, status: 'Active Reader' },
    { id: '3', name: 'Prince Lawrence San Miguel', level: 2, xp: 90, status: 'Needs Help' },
  ]);

  const deleteStudent = (id) => {
    Alert.alert("Remove Student", "Are you sure?", [
        { text: "Cancel" },
        { text: "Yes, Remove", onPress: () => setStudents(students.filter(s => s.id !== id)) }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Students 👨‍🎓</Text>
        <FlatList 
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.avatar} />
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.info}>Lvl {item.level} • {item.xp} XP</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => alert('Edit Mode')} style={styles.iconBtn}>
                    <Ionicons name="pencil" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteStudent(item.id)} style={styles.iconBtn}>
                    <Ionicons name="trash" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};
