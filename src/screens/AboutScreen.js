import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { colors, font } from '../theme';

export default function AboutScreen() {
  const open = (url) => Linking.openURL(url);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚡ TaskManager+</Text>
      <Text style={styles.version}>Version 1.0.0  ·  Android  ·  by G23</Text>

      <View style={styles.sep} />

      <Text style={styles.desc}>
        TaskManager+ is a lightweight Android system monitor.{'\n'}
        View battery, RAM, device info, installed apps, and manage your cache — all from one clean dark interface.
      </Text>

      <View style={styles.sep} />

      <Text style={styles.sectionLabel}>MADE BY</Text>
      <TouchableOpacity style={styles.linkCard} onPress={() => open('https://g23dev.vercel.app/')}>
        <View>
          <Text style={styles.linkName}>🌐  g23dev.vercel.app</Text>
          <Text style={styles.linkDesc}>G23's dev portfolio and projects</Text>
        </View>
        <Text style={styles.arrow}>↗</Text>
      </TouchableOpacity>

      <View style={styles.sep} />

      <Text style={styles.sectionLabel}>ALSO BY G23</Text>
      <TouchableOpacity
        style={styles.sponsorCard}
        onPress={() => open('https://g23dev.vercel.app/project/getsysinfo')}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.sponsorName}>🖥️  G23-GetSysInfo</Text>
          <Text style={styles.sponsorDesc}>
            A lightweight tool to retrieve and display detailed system information.
            Hardware specs, OS info, and more — all in one place.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sponsorBtn}
          onPress={() => open('https://g23dev.vercel.app/project/getsysinfo')}
        >
          <Text style={styles.sponsorBtnText}>View</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.sep} />

      <Text style={styles.sectionLabel}>ALSO AVAILABLE</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>💻  TaskManager+ for Windows</Text>
        <Text style={styles.infoSub}>Process manager, profiles, system tweaks — full desktop version</Text>
      </View>

      <Text style={styles.footer}>© 2025 G23 · TaskManager+ is open source</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 40 },
  title:   { color: colors.accent, fontSize: 28, fontWeight: 'bold', letterSpacing: 3 },
  version: { color: colors.textSec, fontSize: font.sm, marginTop: 4, marginBottom: 16 },
  sep:     { height: 1, backgroundColor: colors.border, marginVertical: 18 },
  desc:    { color: '#666', fontSize: font.md, lineHeight: 22 },
  sectionLabel: { color: colors.textSec, fontSize: font.xs, letterSpacing: 2, marginBottom: 10 },
  linkCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  linkName: { color: colors.blue, fontSize: font.md, fontWeight: '600' },
  linkDesc: { color: colors.textSec, fontSize: font.sm, marginTop: 2 },
  arrow:    { color: colors.blue, fontSize: 20 },
  sponsorCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  sponsorName: { color: colors.textPri, fontSize: font.md, fontWeight: 'bold', marginBottom: 4 },
  sponsorDesc: { color: colors.textSec, fontSize: font.sm, lineHeight: 17 },
  sponsorBtn:  { backgroundColor: '#0a2a1a', borderWidth: 1, borderColor: colors.accent, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  sponsorBtnText: { color: colors.accent, fontWeight: 'bold', fontSize: font.sm },
  infoCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 14 },
  infoText: { color: colors.textPri, fontSize: font.md, fontWeight: '600' },
  infoSub:  { color: colors.textSec, fontSize: font.sm, marginTop: 4 },
  footer:   { color: colors.textMuted, fontSize: font.xs, textAlign: 'center', marginTop: 24 },
});
