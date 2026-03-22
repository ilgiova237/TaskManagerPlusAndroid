import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { colors, font } from '../theme';

async function getDirSize(uri) {
  try {
    const info = await FileSystem.getInfoAsync(uri, { size: true });
    if (!info.exists) return 0;
    if (!info.isDirectory) return info.size || 0;
    const entries = await FileSystem.readDirectoryAsync(uri);
    let total = 0;
    for (const entry of entries) {
      const child = uri.endsWith('/') ? `${uri}${entry}` : `${uri}/${entry}`;
      total += await getDirSize(child);
    }
    return total;
  } catch (_) {
    return 0;
  }
}

async function clearDir(uri) {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists || !info.isDirectory) return 0;
    const entries = await FileSystem.readDirectoryAsync(uri);
    let count = 0;
    for (const entry of entries) {
      const child = uri.endsWith('/') ? `${uri}${entry}` : `${uri}/${entry}`;
      try {
        await FileSystem.deleteAsync(child, { idempotent: true });
        count++;
      } catch (_) {}
    }
    return count;
  } catch (_) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

const CACHE_DIRS = [
  {
    key: 'appCache',
    label: '📦  App Cache',
    desc: "This app's own cache directory",
    getUri: () => FileSystem.cacheDirectory,
  },
  {
    key: 'tmpCache',
    label: '🗂  Temp Files',
    desc: "Temporary files stored by this app",
    getUri: () => FileSystem.temporaryDirectory,
  },
];

export default function CacheScreen() {
  const [sizes, setSizes]     = useState({});
  const [loading, setLoading] = useState({});
  const [log, setLog]         = useState('');

  const scanAll = useCallback(async () => {
    setLog('Scanning...');
    const newSizes = {};
    for (const d of CACHE_DIRS) {
      const uri = d.getUri();
      if (uri) newSizes[d.key] = await getDirSize(uri);
    }
    setSizes(newSizes);
    const total = Object.values(newSizes).reduce((a, b) => a + b, 0);
    setLog(`✓ Scan complete — total: ${formatBytes(total)}`);
  }, []);

  const clearOne = useCallback(async (d) => {
    const uri = d.getUri();
    if (!uri) {
      setLog(`✗ ${d.label}: directory not available`);
      return;
    }
    setLoading(l => ({ ...l, [d.key]: true }));
    const count = await clearDir(uri);
    const newSize = await getDirSize(uri);
    setSizes(s => ({ ...s, [d.key]: newSize }));
    setLoading(l => ({ ...l, [d.key]: false }));
    setLog(`✓ ${d.label}: cleared ${count} items`);
  }, []);

  const clearAll = useCallback(() => {
    Alert.alert(
      'Clear All Cache',
      'This will clear all cache directories for this app. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All', style: 'destructive',
          onPress: async () => {
            setLog('Clearing all...');
            let total = 0;
            for (const d of CACHE_DIRS) {
              const uri = d.getUri();
              if (uri) total += await clearDir(uri);
            }
            const newSizes = {};
            for (const d of CACHE_DIRS) {
              const uri = d.getUri();
              if (uri) newSizes[d.key] = await getDirSize(uri);
            }
            setSizes(newSizes);
            setLog(`✓ All cache cleared — ${total} items removed`);
          }
        }
      ]
    );
  }, []);

  const totalSize = Object.values(sizes).reduce((a, b) => a + b, 0);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>🧹 Cache</Text>

      {/* Notice */}
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          ⚠ Android restricts clearing other apps' cache without root.
          This screen manages <Text style={{ color: colors.accent }}>this app's own</Text> cache only.
        </Text>
      </View>

      {/* Total + scan */}
      <View style={styles.totalCard}>
        <View>
          <Text style={styles.totalLabel}>TOTAL CACHE</Text>
          <Text style={styles.totalVal}>{Object.keys(sizes).length ? formatBytes(totalSize) : '—'}</Text>
        </View>
        <TouchableOpacity style={styles.scanBtn} onPress={scanAll}>
          <Text style={styles.scanBtnText}>Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Cache dirs */}
      {CACHE_DIRS.map(d => (
        <View key={d.key} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>{d.label}</Text>
              <Text style={styles.cardDesc}>{d.desc}</Text>
              <Text style={styles.cardSize}>
                {sizes[d.key] !== undefined ? formatBytes(sizes[d.key]) : 'Not scanned'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => clearOne(d)}
              disabled={!!loading[d.key]}
            >
              {loading[d.key]
                ? <ActivityIndicator size="small" color={colors.accent} />
                : <Text style={styles.clearBtnText}>Clear</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Clear all */}
      <TouchableOpacity style={styles.clearAllBtn} onPress={clearAll}>
        <Text style={styles.clearAllText}>🗑  Clear All Cache</Text>
      </TouchableOpacity>

      {/* Log */}
      {!!log && (
        <View style={styles.logBox}>
          <Text style={styles.logText}>{log}</Text>
        </View>
      )}

      <Text style={styles.footer}>g23dev.vercel.app · TaskManager+ by G23</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  pageTitle: { color: colors.accent, fontSize: font.xl, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 },
  notice:  { backgroundColor: '#1a1200', borderWidth: 1, borderColor: '#443300', borderRadius: 6, padding: 10, marginBottom: 14 },
  noticeText: { color: '#aa8800', fontSize: font.sm, lineHeight: 18 },
  totalCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel:{ color: colors.textSec, fontSize: font.xs, letterSpacing: 2 },
  totalVal:  { color: colors.accent, fontSize: font.xxl, fontWeight: 'bold', marginTop: 4 },
  scanBtn:   { backgroundColor: '#0a2a1a', borderWidth: 1, borderColor: colors.accent, borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  scanBtnText: { color: colors.accent, fontWeight: 'bold', fontSize: font.md },
  card:    { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 14, marginBottom: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  cardLabel: { color: colors.textPri, fontSize: font.md, fontWeight: '600' },
  cardDesc:  { color: colors.textSec, fontSize: font.sm, marginTop: 2 },
  cardSize:  { color: colors.accent, fontSize: font.lg, fontWeight: 'bold', marginTop: 6 },
  clearBtn:  { backgroundColor: '#1e0e0e', borderWidth: 1, borderColor: '#aa3333', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 8, marginLeft: 12, minWidth: 60, alignItems: 'center' },
  clearBtnText: { color: colors.red, fontWeight: 'bold', fontSize: font.md },
  clearAllBtn: { backgroundColor: '#1e0e0e', borderWidth: 1, borderColor: '#aa3333', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 14 },
  clearAllText: { color: colors.red, fontWeight: 'bold', fontSize: font.md },
  logBox:  { backgroundColor: '#001a0d', borderWidth: 1, borderColor: '#003322', borderRadius: 6, padding: 10, marginBottom: 10 },
  logText: { color: colors.accent, fontSize: font.sm },
  footer:  { color: colors.textMuted, fontSize: font.xs, textAlign: 'center' },
});
