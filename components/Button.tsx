import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
}

export default function Button({
  title,
  onPress,
  icon,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.button, styles.outline, style];
      case 'ghost':
        return [styles.button, styles.ghost, style];
      default:
        return [styles.button, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.text, styles.outlineText, textStyle];
      case 'ghost':
        return [styles.text, styles.ghostText, textStyle];
      default:
        return [styles.text, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: colors.background,
    fontSize: 16,
    fontFamily: fonts.weight.semibold,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
});