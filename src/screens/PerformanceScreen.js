import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl
} from 'react-native';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import { colors, font } from '../theme';

// ── Helpers ──────────────────────────────────────────────────────────────────
function StatBar({ value, color }) {
  const pct = Math.min(Math.max(value || 0, 0), 100);
  return (
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

function Card({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value, color }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, { color: color || colors.textPri }]}>{value}</Text>
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────
export default function PerformanceScreen() {
  const [battery, setBattery]     = useState(null);
  const [device, setDevice]       = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [level, state, lowPower] = await Promise.all([
        Battery.getBatteryLevelAsync(),
        Battery.getBatteryStateAsync(),
        Battery.isLowPowerModeEnabledAsync(),
      ]);
      setBattery({ level: Math.round(level * 100), state, lowPower });
    } catch (_) {
      setBattery({ level: null, state: null, lowPower: false });
    }

    setDevice({
      brand:        Device.brand,
      modelName:    Device.modelName,
      osVersion:    Device.osVersion,
      totalMemory:  Device.totalMemory,
      deviceType:   Device.deviceType,
      manufacturer: Device.manufacturer,
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const batteryStateLabel = (s) => {
    switch (s) {
      case Battery.BatteryState.CHARGING:    return '⚡ Charging';
      case Battery.BatteryState.FULL:        return '✅ Full';
      case Battery.BatteryState.UNPLUGGED:   return '🔋 Unplugged';
      default:                               return '— Unknown';
    }
  };

  const batteryColor = (lvl) => {
    if (lvl === null) return colors.textSec;
    if (lvl <= 15) return colors.red;
    if (lvl <= 30) return colors.orange;
    return colors.accent;
  };

  const ramGB = device?.totalMemory
    ? (device.totalMemory / (1024 ** 3)).toFixed(1)
    : null;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
    >
      <Text style={styles.pageTitle}>⚡ Performance</Text>
      <Text style={styles.hint}>Pull down to refresh</Text>

      {/* Battery */}
      <Card title="BATTERY">
        <Text style={[styles.bigVal, { color: batteryColor(battery?.level) }]}>
          {battery?.level !== null && battery?.level !== undefined
            ? `${battery.level}%`
            : '—'}
        </Text>
        <StatBar value={battery?.level} color={batteryColor(battery?.level)} />
        <View style={{ marginTop: 10 }}>
          <Row label="Status"    value={batteryStateLabel(battery?.state)} />
          <Row label="Low Power" value={battery?.lowPower ? '⚠ Enabled' : 'Off'} color={battery?.lowPower ? colors.orange : colors.textSec} />
        </View>
      </Card>

      {/* RAM */}
      <Card title="RAM">
        <Text style={[styles.bigVal, { color: colors.accent }]}>
          {ramGB ? `${ramGB} GB` : '—'}
        </Text>
        <Text style={styles.cardNote}>Total physical memory (reported by OS)</Text>
        <Text style={styles.cardNote}>
          Note: Android restricts per-app RAM reading without root.
        </Text>
      </Card>

      {/* Device Info */}
      <Card title="DEVICE">
        <Row label="Brand"        value={device?.brand        || '—'} />
        <Row label="Model"        value={device?.modelName    || '—'} />
        <Row label="Manufacturer" value={device?.manufacturer || '—'} />
        <Row label="Android"      value={device?.osVersion    || '—'} color={colors.blue} />
      </Card>

      <Text style={styles.footer}>
        g23dev.vercel.app · TaskManager+ by G23
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: colors.bg },
  content:   { padding: 16, paddingBottom: 40 },
  pageTitle: { color: colors.accent, fontSize: font.xl, fontWeight: 'bold', letterSpacing: 2, marginBottom: 2 },
  hint:      { color: colors.textMuted, fontSize: font.xs, marginBottom: 16 },
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { color: colors.textSec, fontSize: font.xs, letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' },
  cardNote:  { color: colors.textMuted, fontSize: font.xs, marginTop: 6 },
  bigVal:    { fontSize: font.xxl, fontWeight: 'bold', marginBottom: 8 },
  barBg: {
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill:   { height: '100%', borderRadius: 4 },
  row:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: colors.bgCard2 },
  rowLabel:  { color: colors.textSec, fontSize: font.md },
  rowValue:  { color: colors.textPri, fontSize: font.md, fontWeight: '500' },
  footer:    { color: colors.textMuted, fontSize: font.xs, textAlign: 'center', marginTop: 10 },
});
