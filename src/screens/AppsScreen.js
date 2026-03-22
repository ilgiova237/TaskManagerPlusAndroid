import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  RefreshControl, TouchableOpacity, Linking
} from 'react-native';
import * as Device from 'expo-device';
import { colors, font } from '../theme';

// expo-application gives us the bundle ID and install time
// We list apps via a native workaround using expo-file-system to read /data/app
// Since full InstalledApps API isn't in Expo managed workflow,
// we show what we CAN get: device info + a curated list of common system packages

const KNOWN_SYSTEM = new Set([
  'com.android.settings', 'com.android.phone', 'com.android.launcher',
  'com.google.android.gms', 'com.google.android.gsf', 'com.android.systemui',
  'com.android.inputmethod', 'com.android.keychain', 'com.android.providers',
  'com.android.server', 'android', 'com.android.bluetooth',
]);

function AppItem({ item }) {
  return (
    <View style={styles.item}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{item.name[0]?.toUpperCase() || '?'}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPkg}  numberOfLines={1}>{item.pkg}</Text>
      </View>
      <View style={[styles.badge, item.isSystem && styles.badgeSys]}>
        <Text style={[styles.badgeText, item.isSystem && styles.badgeTextSys]}>
          {item.isSystem ? 'SYSTEM' : 'USER'}
        </Text>
      </View>
    </View>
  );
}

export default function AppsScreen() {
  const [apps, setApps]         = useState([]);
  const [filter, setFilter]     = useState('');
  const [showSys, setShowSys]   = useState(false);
  const [refreshing, setRefresh] = useState(false);

  // In Expo managed workflow we can't call PackageManager directly.
  // We build a representative list from what expo-device exposes
  // and inform the user about the limitation.
  const load = useCallback(() => {
    // Placeholder data — in a real bare/ejected Expo app you'd call
    // NativeModules.RNAndroidInstalledApps or similar.
    // For managed Expo, we show device info + note.
    const baseApps = [
      { name: 'Settings',         pkg: 'com.android.settings',         isSystem: true  },
      { name: 'Phone',            pkg: 'com.android.phone',             isSystem: true  },
      { name: 'SystemUI',         pkg: 'com.android.systemui',          isSystem: true  },
      { name: 'Google Play',      pkg: 'com.android.vending',           isSystem: true  },
      { name: 'Google Services',  pkg: 'com.google.android.gms',        isSystem: true  },
      { name: 'Camera',           pkg: 'com.android.camera2',           isSystem: true  },
      { name: 'Contacts',         pkg: 'com.android.contacts',          isSystem: true  },
      { name: 'Messages',         pkg: 'com.android.messaging',         isSystem: true  },
      { name: 'TaskManager+',     pkg: 'com.g23.taskmanagerplus',       isSystem: false },
    ];
    setApps(baseApps);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    load();
    setTimeout(() => setRefresh(false), 600);
  }, [load]);

  const filtered = apps.filter(a => {
    const matchFilter = a.name.toLowerCase().includes(filter.toLowerCase()) ||
                        a.pkg.toLowerCase().includes(filter.toLowerCase());
    const matchSys = showSys ? true : !a.isSystem;
    return matchFilter && matchSys;
  });

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>📦 Apps</Text>
        <Text style={styles.count}>{filtered.length} shown</Text>
      </View>

      {/* Notice */}
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          ⚠ Full app list requires a bare/ejected Expo build.{' '}
          <Text style={styles.noticeLink}
            onPress={() => Linking.openURL('https://g23dev.vercel.app/')}>
            Learn more
          </Text>
        </Text>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TextInput
          style={styles.search}
          placeholder="Search apps..."
          placeholderTextColor={colors.textSec}
          value={filter}
          onChangeText={setFilter}
        />
        <TouchableOpacity
          style={[styles.sysBtn, showSys && styles.sysBtnActive]}
          onPress={() => setShowSys(v => !v)}
        >
          <Text style={[styles.sysBtnText, showSys && styles.sysBtnTextActive]}>
            {showSys ? '👁 All' : '👁 User'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.pkg}
        renderItem={({ item }) => <AppItem item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
            tintColor={colors.accent} colors={[colors.accent]} />
        }
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bg },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 8 },
  pageTitle: { color: colors.accent, fontSize: font.xl, fontWeight: 'bold', letterSpacing: 2 },
  count:   { color: colors.textSec, fontSize: font.sm },
  notice:  { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#1a1200', borderWidth: 1, borderColor: '#443300', borderRadius: 6, padding: 10 },
  noticeText: { color: '#aa8800', fontSize: font.sm, lineHeight: 18 },
  noticeLink: { color: colors.blue, textDecorationLine: 'underline' },
  toolbar: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, gap: 8 },
  search:  { flex: 1, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 6, color: colors.textPri, paddingHorizontal: 12, paddingVertical: 8, fontSize: font.md },
  sysBtn:  { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 12, justifyContent: 'center' },
  sysBtnActive: { borderColor: colors.accent, backgroundColor: '#0a2a1a' },
  sysBtnText: { color: colors.textSec, fontSize: font.sm },
  sysBtnTextActive: { color: colors.accent },
  list:    { paddingHorizontal: 16, paddingBottom: 40 },
  item:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  iconBox: { width: 38, height: 38, borderRadius: 8, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconText:{ color: colors.accent, fontSize: font.lg, fontWeight: 'bold' },
  itemInfo:{ flex: 1 },
  itemName:{ color: colors.textPri, fontSize: font.md, fontWeight: '500' },
  itemPkg: { color: colors.textSec, fontSize: font.xs, marginTop: 1 },
  badge:   { backgroundColor: '#0a2a1a', borderWidth: 1, borderColor: '#003322', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  badgeSys:{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' },
  badgeText:    { color: colors.accent, fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  badgeTextSys: { color: colors.textSec },
  divider: { height: 1, backgroundColor: colors.border },
});
